import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { UUID } from "crypto";
import { EContactType } from "src/common/enum/contact-type.enum";
import { UtilityService } from "src/common/services/utility.service";
import { EntityLookupService } from "src/modules/entity-lookup/services/entity-lookup.service";
import { VerificationCode } from "src/typeorm/entities/auth/verification-code.entity";
import { MoreThan, Repository } from "typeorm";
import { VerifyEmailDto } from "../dto/verify-email.dto";
import { EVerificationStatusType } from "src/common/enum/verification-status.enum";
import { ResendEmailCodeDto } from "../dto/resend-email-code.dto";
import { AddEmailDto } from "../dto/add-email.dto";
import { AccessToken, User, UserEmail, UserPhone } from "src/typeorm/entities";
import { PhoneDto } from "../dto/phone.dto";
import { WhatsappService } from "src/common/services/whatsapp.service";
import { VerifyPhoneDto } from "../dto/verify-mobile.dto";
import { instanceToPlain } from "class-transformer";
import { removeLeadingZero } from "src/common/utils/utils";
import { AccessTokenGeneratorService } from "./access-token-generator.service";
import { EVerificationPurpose } from "src/common/enum/verification-purpose.enum";


@Injectable()
export class VerificationService {

  constructor(
    private entityLookupService: EntityLookupService,
    private utility: UtilityService,

    @InjectRepository(VerificationCode)
    private verificationCodeRepo: Repository<VerificationCode>,

    @InjectRepository(UserEmail)
    private userEmailRepo: Repository<UserEmail>,

    @InjectRepository(UserPhone)
    private userPhoneRepo: Repository<UserPhone>,

    @InjectRepository(User)
    private usersRepo: Repository<User>,

    @InjectRepository(AccessToken)
    private accessTokensRepository: Repository<AccessToken>,

    private whatsappService: WhatsappService,
    private accessTokenGenerator: AccessTokenGeneratorService,

  ) { }

  async generateEmailVerificationCode(emailId: UUID) {
    const code = await this.utility.getUniqueVerificationCode();
    const email = await this.userEmailRepo.findOne({
      where: { id: emailId, status: EVerificationStatusType.NOT_VERIFIED }
    }) as UserEmail;

    const record = await this.verificationCodeRepo.findOne({
      where: { email: { id: emailId } }
    });

    const expiresAt = new Date(Date.now() + 3e5); // 5 minutes

    if (record) {
      return await this.verificationCodeRepo.update(record.id, {
        code,
        expiresAt
      });
    } else {
      const createdVerificationCode = this.verificationCodeRepo.create({
        id: this.utility.generateUUID(),
        code,
        type: EContactType.EMAIL,
        email,
        expiresAt
      });

      return await this.verificationCodeRepo.save(createdVerificationCode);
    }
  }

  async generateAccountVerificationCode(dto: PhoneDto): Promise<VerificationCode> {
    const code = await this.utility.getUniqueVerificationCode();
    const expiresAt = new Date(Date.now() + 3e5); // 5 minutes

    const fullPhoneNumber = `${dto.phoneCode}${dto.number}`;

    const verifiedPhone = await this.entityLookupService.findVerifiedUserPhoneByPhoneNumber(fullPhoneNumber);

    if (verifiedPhone) {
      throw new ConflictException("Phone number is already used by another account.");
    }

    const unverifiedPhone = await this.entityLookupService.findUnverifiedUserPhoneByPhoneNumber(fullPhoneNumber) as UserPhone;
    const existingCode = await this.entityLookupService.findVerificationCodePhoneNumber(fullPhoneNumber) as VerificationCode;

    if (existingCode) {
      await this.verificationCodeRepo.update(existingCode.id, {
        code,
        expiresAt
      });

      return await this.entityLookupService.findVerificationCodeById(existingCode.id) as VerificationCode;
    }

    const createdVerificationCode = this.verificationCodeRepo.create({
      id: this.utility.generateUUID(),
      code,
      type: EContactType.MOBILE,
      purpose: EVerificationPurpose.ACCOUNT,
      phone: { id: unverifiedPhone.id },
      expiresAt
    });

    return await this.verificationCodeRepo.save(createdVerificationCode);
  }

  async generateLoginVerificationCode(fullPhoneNumber: string): Promise<VerificationCode> {
    const code = await this.utility.getUniqueVerificationCode();
    const phone = await this.entityLookupService.findVerifiedUserPhoneByPhoneNumber(fullPhoneNumber) as UserPhone;
    const expiresAt = new Date(Date.now() + 3e5); // 5 minutes

    if(!phone){
      throw new NotFoundException("Phone number does not belong to an account.");
    }

    const createdVerificationCode = this.verificationCodeRepo.create({
      id: this.utility.generateUUID(),
      code,
      type: EContactType.MOBILE,
      purpose: EVerificationPurpose.LOGIN,
      phone: { id: phone.id },
      expiresAt,
    });

    return await this.verificationCodeRepo.save(createdVerificationCode);
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const verificationCode = await this.verificationCodeRepo.findOne({
      where: {
        code: dto.code,
        email: {
          email: dto.email, status:
            EVerificationStatusType.NOT_VERIFIED
        },
        expiresAt: MoreThan(new Date())
      },
      relations: ['email']
    });

    if (!verificationCode) throw new BadRequestException('Invalid verification code');

    await this.userEmailRepo.update(verificationCode.email.id, { status: EVerificationStatusType.VERIFIED });

    return { complete: true };
  }

  async verifyPhone(dto: VerifyPhoneDto) {
    dto.number = removeLeadingZero(dto.number);
    const fullPhoneNumber = `${dto.phoneCode}${dto.number}`;

    const verificationCode = await this.verificationCodeRepo.findOne({
      where: {
        code: dto.code,
        purpose: EVerificationPurpose.ACCOUNT,
        phone: {
          fullPhoneNumber: fullPhoneNumber,
          status: EVerificationStatusType.NOT_VERIFIED,
        },
        expiresAt: MoreThan(new Date()),
      },
      relations: ['phone']
    });

    if (!verificationCode) throw new BadRequestException('Invalid verification code');

    await this.userPhoneRepo.update(verificationCode.phone.id, { status: EVerificationStatusType.VERIFIED });

    let user = await this.entityLookupService.findUserByPhoneNumber(fullPhoneNumber);

    if (user?.verified == false) {
      await this.usersRepo.update(user.id, { verified: true });

      const signedToken = await this.accessTokenGenerator.generateAccessToken(
        user.id,
        user.role,
      );

      const accessToken = this.accessTokensRepository.create({
        id: signedToken.id,
        userId: user.id,
        refreshToken: signedToken.refresh,
      });

      this.accessTokensRepository.save(accessToken);

      user = await this.entityLookupService.findUserByPhoneNumber(fullPhoneNumber) as User;
      user.apiToken = signedToken.token;
      user.refreshToken = signedToken.refresh;

    }

    return instanceToPlain(user);
  }

  async resendEmailVerificationCode(dto: ResendEmailCodeDto) {
    const email = await this.userEmailRepo.findOne({
      where: {
        email: dto.email,
        status: EVerificationStatusType.NOT_VERIFIED
      }
    }) as UserEmail;

    if (email) await this.generateEmailVerificationCode(email.id)

    return { complete: true };
  }

  async sendLoginCode(dto: PhoneDto) {
    dto.number = removeLeadingZero(dto.number);
    const fullPhoneNumber = `${dto.phoneCode}${dto.number}`;
    const code = await this.generateLoginVerificationCode(fullPhoneNumber);
    await this.whatsappService.sendText(process.env.WHATSAPP_NUMBER as string, `رمز التحقق الخاص بك هو: ${code.code}`);
    return { complete: true }
  }

  async addEmail(dto: AddEmailDto, userId: UUID) {
    const user = await this.entityLookupService.findUserById(userId) as User;

    // Check if email is registered
    let email = await this.userEmailRepo.findOne({
      where: {
        email: dto.email,
        status: EVerificationStatusType.VERIFIED
      }
    })

    if (email) throw new ConflictException('Email alrady exists');

    // Check unverified emails
    email = await this.userEmailRepo.findOne({
      where: {
        email: dto.email,
        status: EVerificationStatusType.NOT_VERIFIED
      }
    });

    // Add or Update email to the current user
    let newEmail;

    if (email) {
      newEmail = await this.userEmailRepo.update(email.id, {
        user: user
      });
    } else {
      newEmail = this.userEmailRepo.create({
        id: this.utility.generateUUID(),
        email: dto.email,
        user: user,
      });
      await this.userEmailRepo.save(newEmail);
    }

    // Generate verification code
    await this.generateEmailVerificationCode(newEmail.id)

    return { complete: true };
  }
}