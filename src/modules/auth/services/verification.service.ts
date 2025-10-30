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
import { User, UserEmail } from "src/typeorm/entities";


@Injectable()
export class VerificationService {

  constructor(
    private entityLookupService: EntityLookupService,
    private utility: UtilityService,

    @InjectRepository(VerificationCode)
    private verificationCodeRepo: Repository<VerificationCode>,

    @InjectRepository(UserEmail)
    private userEmailRepo: Repository<UserEmail>,
  ) { }

  async generateVerificationCode(type: EContactType, emailOrPhoneId: UUID) {
    switch (type) {
      case EContactType.EMAIL:
        this.generateEmailVerificationCode(emailOrPhoneId);
        break;
      case EContactType.MOBILE:

        break;
    }
  }

  async generateEmailVerificationCode(emailId: UUID) {
    const code = await this.utility.getUniqueVerificationCode();
    const email = await this.userEmailRepo.findOne({
      where: {
        id: emailId,
        status: EVerificationStatusType.NOT_VERIFIED
      }
    }) as UserEmail;

    const record = await this.verificationCodeRepo.findOne({
      where: {
        email: {
          id: emailId
        }
      }
    });

    if (record) {
      await this.verificationCodeRepo.update(record.id, {
        code: code,
        expiresAt: new Date(Date() + 3e5)
      });
    } else {
      const verificationCode = this.verificationCodeRepo.create({
        id: this.utility.generateUUID(),
        code,
        type: EContactType.EMAIL,
        email: email,
        expiresAt: new Date(Date.now() + 3e5)
      });
      await this.verificationCodeRepo.save(verificationCode);
    }

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

    if (email) await this.generateVerificationCode(EContactType.EMAIL, email.id)

    return { complete: true };
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
    await this.generateVerificationCode(EContactType.EMAIL, newEmail.id)

    return { complete: true };
  }
}