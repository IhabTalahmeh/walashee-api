import { BadRequestException, Injectable } from "@nestjs/common";
import { ForgotEmailPasswordDto } from "../dto/forgot-email-password.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { PasswordResetCode, UserEmail } from "src/typeorm/entities";
import { Repository } from "typeorm";
import { EntityLookupService } from "src/modules/entity-lookup/services/entity-lookup.service";
import { UtilityService } from "src/common/services/utility.service";
import { VerificationCode } from "src/typeorm/entities/auth/verification-code.entity";
import { EContactType } from "src/common/enum/contact-type.enum";


@Injectable()
export class PasswordService {

  constructor(

    @InjectRepository(PasswordResetCode)
    private passwordResetCodeRepo: Repository<PasswordResetCode>,

    @InjectRepository(UserEmail)
    private userEmailRepo: Repository<UserEmail>,

    @InjectRepository(VerificationCode)
    private verificationCodeRepo: Repository<VerificationCode>,

    private entityLookupService: EntityLookupService,
    private utility: UtilityService,

  ) { }

  async forgotEmailPassword(dto: ForgotEmailPasswordDto) {
    const code = await this.utility.getUniqueVerificationCode();
    const email = await this.userEmailRepo.findOne({
      where: {
        email: dto.email
      }
    }) as UserEmail;

    if (!email) throw new BadRequestException('Email does not exist');

    const record = await this.verificationCodeRepo.findOne({
      where: {
        email: {
          email: dto.email
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

    return { complete: true };
  }
}