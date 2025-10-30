import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { UUID } from "crypto";
import { Address } from "src/typeorm/entities/common/address.entity";
import { Country } from "src/typeorm/entities/common/county.entity";
import { UserEmail } from "src/typeorm/entities/user/user-email.entity";
import { User } from "src/typeorm/entities/user/user.entity";
import { Repository } from "typeorm";


@Injectable()
export class EntityLookupService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Address) private addressesRepo: Repository<Address>,
    @InjectRepository(UserEmail) private userEmailsRepo: Repository<UserEmail>,
    @InjectRepository(Country) private countryRepo: Repository<Country>,
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

  async findUserByMobileNumber(fullPhoneNumber: string, relations: string[] = []) {
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
}