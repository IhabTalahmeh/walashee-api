import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { UUID } from "crypto";
import { EVerificationStatusType } from "src/common/enum/verification-status.enum";
import { UserPhone } from "src/typeorm/entities";
import { VerificationCode } from "src/typeorm/entities/auth/verification-code.entity";
import { Address } from "src/typeorm/entities/common/address.entity";
import { Country } from "src/typeorm/entities/common/county.entity";
import { Team } from "src/typeorm/entities/common/team.entity";
import { UserEmail } from "src/typeorm/entities/user/user-email.entity";
import { User } from "src/typeorm/entities/user/user.entity";
import { Repository } from "typeorm";


@Injectable()
export class EntityLookupService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Address) private addressesRepo: Repository<Address>,
    @InjectRepository(UserEmail) private userEmailsRepo: Repository<UserEmail>,
    @InjectRepository(UserPhone) private userPhoneRepo: Repository<UserPhone>,
    @InjectRepository(Country) private countryRepo: Repository<Country>,
    @InjectRepository(VerificationCode) private verificationCodeRepo: Repository<VerificationCode>,
    @InjectRepository(Team) private teamRepo: Repository<Team>,
  ) { }

  async findUserById(userId: UUID, relations: string[] = []) {
    return await this.usersRepo.findOne({
      where: {
        id: userId
      },
      relations,
    });
  }

  async findAddressById(addressId: UUID, relations: string[] = []) {
    return await this.addressesRepo.findOne({
      where: {
        id: addressId
      },
      relations,
    });
  }

  async findUserEmailByEmailId(emailId: UUID, relations: string[] = []) {
    return await this.userEmailsRepo.findOne({
      where: {
        id: emailId
      },
      relations,
    });
  }

  async findUserEmailByEmail(email: string, relations: string[] = []) {
    return await this.userEmailsRepo.findOne({
      where: {
        email
      },
      relations,
    });
  }

  async findUserPhoneByPhoneNumber(fullPhoneNumber: string, relations: string[] = []) {
    return await this.userPhoneRepo.findOne({
      where: {
        fullPhoneNumber,
      },
      relations,
    });
  }

  async findVerifiedUserPhoneByPhoneNumber(fullPhoneNumber: string, relations: string[] = []) {
    return await this.userPhoneRepo.findOne({
      where: {
        fullPhoneNumber,
        status: EVerificationStatusType.VERIFIED,
      },
      relations,
    });
  }

  async findUnverifiedUserPhoneByPhoneNumber(fullPhoneNumber: string, relations: string[] = []) {
    return await this.userPhoneRepo.findOne({
      where: {
        fullPhoneNumber,
        status: EVerificationStatusType.NOT_VERIFIED,
      },
      relations,
    });
  }

  async findVerificationCodeById(id: UUID, relations = []) {
    return await this.verificationCodeRepo.findOne({
      where: {
        id,
      },
      relations,
    });
  }

  async findVerificationCodePhoneNumber(fullPhoneNumber: string, relations = []) {
    return await this.verificationCodeRepo.findOne({
      where: {
        phone: {
          fullPhoneNumber,
        },
      },
      relations,
    });
  }

  async findCountryByIso(iso: string, relations: string[] = []) {
    if (iso) {
      return await this.countryRepo.findOne({
        where: {
          iso
        },
        relations,
      });
    }
    return null;
  }

  async findCountryByPhoneCode(phoneCode: string, relations: string[] = []) {
    if (phoneCode) {
      return await this.countryRepo.findOne({
        where: {
          phoneCode
        },
        relations,
      });
    }
    return null;
  }

  async findUserByPhoneNumber(fullPhoneNumber: string, relations: string[] = []) {
    if (fullPhoneNumber) {
      return await this.usersRepo.findOne({
        where: {
          phones: {
            fullPhoneNumber: fullPhoneNumber,
          }
        },
        relations,
      });
    }
    return null;
  }

  async findTeamByOwnerId(ownerId: UUID, relations = []) {
    return await this.teamRepo.findOne({
      where: {
        owner: { id: ownerId },
      },
      relations,
    });
  }

  async findTeamById(id: UUID, relations = []) {
    return await this.teamRepo.findOne({
      where: {
        id,
      },
      relations,
    });
  }

  async findUserTeams(userId: UUID, relations = []) {
    return await this.teamRepo.find({
      where: {
        owner: {id: userId},
      },
      relations,
    });
  }
}