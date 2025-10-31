import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
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
import { User, UserEmail, UserPhone } from "src/typeorm/entities";
import { ResendPhoneCodeDto } from "../dto/resent-mobile-code.dto";
import { WhatsappService } from "src/common/services/whatsapp.service";


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

    private whatsappService: WhatsappService,

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

  async generatePhoneVerificationCode(phoneId: UUID): Promise<VerificationCode> {
    const code = await this.utility.getUniqueVerificationCode();
    const phone = await this.userPhoneRepo.findOne({
      where: { id: phoneId, status: EVerificationStatusType.NOT_VERIFIED }
    }) as UserPhone;

    const record = await this.verificationCodeRepo.findOne({
      where: { phone: { id: phoneId } }
    });

    const expiresAt = new Date(Date.now() + 3e5); // 5 minutes

    if (record) {
      await this.verificationCodeRepo.update(record.id, {
        code,
        expiresAt
      });

      return await this.verificationCodeRepo.findOne({
        where: { id: record.id }
      }) as VerificationCode;
    }

    const createdVerificationCode = this.verificationCodeRepo.create({
      id: this.utility.generateUUID(),
      code,
      type: EContactType.MOBILE,
      phone,
      expiresAt
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

  async resendMobileVerificationCode(dto: ResendPhoneCodeDto) {
    const userPhone = await this.entityLookupService.findUserPhoneByPhoneNumber(dto.fullPhoneNumber);
    const code = await this.generatePhoneVerificationCode(userPhone?.id as UUID);
    return await this.whatsappService.sendText(process.env.WHATSAPP_NUMBER as string, `رمز التحقق الخاص بك هو: ${code.code}`);
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