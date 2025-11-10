import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterByEmailDto, RegisterByMobileDto } from '../dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { UtilityService } from 'src/common/services/utility.service';
import { LoginByEmailDto, LoginByMobileDto } from '../dto/login.dto';
import { AccessTokenGeneratorService } from './access-token-generator.service';
import { AccessToken, User, UserEmail, UserPhone } from 'src/typeorm/entities';
import { IUser } from 'src/common/interfaces';
import type { UUID } from "crypto";
import { instanceToPlain } from 'class-transformer';
import { IAccessTokenPayload } from 'src/common/types';
import { EVerificationStatusType } from 'src/common/enum/verification-status.enum';
import { VerificationCode } from 'src/typeorm/entities/auth/verification-code.entity';
import { EContactType } from 'src/common/enum/contact-type.enum';
import { EntityLookupService } from 'src/modules/entity-lookup/services/entity-lookup.service';
import { VerificationService } from './verification.service';
import { SwitchRoleDto } from '../dto/switch-role.dto';
import { WhatsappService } from 'src/common/services/whatsapp.service';
import { removeLeadingZero } from 'src/common/utils/utils';
import { EVerificationPurpose } from 'src/common/enum/verification-purpose.enum';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(AccessToken)
    private accessTokensRepository: Repository<AccessToken>,

    @InjectRepository(UserEmail)
    private userEmailRepo: Repository<UserEmail>,

    private entityLookupService: EntityLookupService,

    @InjectRepository(VerificationCode)
    private verificationCodeRepo: Repository<VerificationCode>,

    @InjectRepository(UserPhone)
    private userPhoneRepo: Repository<UserPhone>,

    @InjectRepository(User)
    private usersRepo: Repository<User>,

    private accessTokenGenerator: AccessTokenGeneratorService,
    private verificationService: VerificationService,

    private utility: UtilityService,
    private whatsappService: WhatsappService
  ) { }

  async getCurrentUser(userId: UUID) {
    const user = await this.entityLookupService.findUserById(userId);
    return instanceToPlain(user);
  }

  async registerByMobile(dto: RegisterByMobileDto) {
    dto.number = removeLeadingZero(dto.number)
    const fullPhoneNumber = `${dto.phoneCode}${dto.number}`

    const userPhone = await this.entityLookupService.findUserPhoneByPhoneNumber(fullPhoneNumber);

    if (!userPhone) {
      const createdUser = this.usersRepository.create({
        id: this.utility.generateUUID(),
      });

      const savedUser = await this.usersRepository.save(createdUser)
      const country = await this.entityLookupService.findCountryByPhoneCode(dto.phoneCode);

      const createdPhone = this.userPhoneRepo.create({
        id: this.utility.generateUUID(),
        user: savedUser,
        phoneCode: dto.phoneCode,
        number: dto.number,
        fullPhoneNumber: `${fullPhoneNumber}`,
        country: { id: country?.id },
      });

      await this.userPhoneRepo.save(createdPhone);

      const code = await this.verificationService.generateAccountVerificationCode(dto);
      await this.whatsappService.sendText(process.env.WHATSAPP_NUMBER as string, `رمز التحقق الخاص بك هو: ${code.code}`);

    }

    if (userPhone?.status == EVerificationStatusType.VERIFIED) {
      throw new ConflictException("Phone number is already used by another account");
    }

    if (userPhone?.status == EVerificationStatusType.NOT_VERIFIED) {
      const code = await this.verificationService.generateAccountVerificationCode(dto);
      await this.whatsappService.sendText(process.env.WHATSAPP_NUMBER as string, `رمز التحقق الخاص بك هو: ${code.code}`);
    }

    const user = await this.entityLookupService.findUserByPhoneNumber(fullPhoneNumber);

    return instanceToPlain(user);
  }

  async registerByEmail(dto: RegisterByEmailDto) {
    const user = await this.findByEmail(dto.email);
    if (user) throw new ConflictException();

    dto.password = await this.utility.hashPassword(dto.password);

    const userEntity = this.usersRepository.create(dto);
    userEntity.id = this.utility.generateUUID();

    const newUser = await this.usersRepository.save(userEntity);

    const newEmail = this.userEmailRepo.create({
      id: this.utility.generateUUID(),
      email: dto.email,
      user: newUser
    });

    const email = await this.userEmailRepo.save(newEmail);
    await this.verificationService.generateEmailVerificationCode(email.id);
    return instanceToPlain(newUser);
  }

  public async refreshAccessToken(
    token: IAccessTokenPayload,
    refreshToken: string,
  ) {
    const tokenRecord = await this.accessTokensRepository.findOne({
      where: {
        userId: token.sub,
        id: token.jti,
        expired: false,
        blacklisted: false,
      },
    });

    if (!tokenRecord) {
      throw new UnauthorizedException();
    }

    if (tokenRecord.refreshToken !== refreshToken) {

      tokenRecord.blacklisted = true;
      this.accessTokensRepository.save(tokenRecord);

      throw new UnauthorizedException();
    }

    const user = await this.usersRepository.findOne({
      where: { id: token.sub },
    });
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    const refreshed = await this.accessTokenGenerator.generateAccessToken(
      token.sub,
      user.role,
    );

    await this.accessTokensRepository.save({
      id: refreshed.id,
      userId: token.sub,
      refreshToken: refreshed.refresh,
    });

    // Disable the sent token so tha the new one is only used.
    tokenRecord.expired = true;
    await this.accessTokensRepository.save(tokenRecord);

    return {
      apiToken: refreshed.token,
      refreshToken: refreshed.refresh,
      role: user.role,
      useAs: user.useAs,
    };
  }


  async loginByEmail(loginByEmail: LoginByEmailDto) {
    const user = await this.findByEmail(loginByEmail.email);
    if (!user) throw new UnauthorizedException();

    const isPasswordMatch: boolean = await this.utility.comparePassword(
      loginByEmail.password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException();
    }

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

    user.apiToken = signedToken.token;
    user.refreshToken = signedToken.refresh;

    return instanceToPlain(user);
  }

  async loginByPhone(dto: LoginByMobileDto) {
    dto.number = removeLeadingZero(dto.number);
    const fullPhoneNumber = `${dto.phoneCode}${dto.number}`;

    const verificationCode = await this.verificationCodeRepo.findOne({
      where: {
        code: dto.code,
        purpose: EVerificationPurpose.LOGIN,
        type: EContactType.MOBILE,
        phone: {
          fullPhoneNumber: fullPhoneNumber,
          status: EVerificationStatusType.VERIFIED,
        },
        expiresAt: MoreThan(new Date()),
      },
      relations: ['phone']
    });

    if (!verificationCode) throw new BadRequestException('Invalid verification code');

    let user = await this.entityLookupService.findUserByPhoneNumber(fullPhoneNumber) as User;

    if (user.verified == false) {
      await this.usersRepo.update(user.id, { verified: true });
    }

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

    return instanceToPlain(user);
  }


  async login(userId: UUID) {
    const user = await this.findById(userId);
    if (!user) throw new UnauthorizedException();

    // if (!user.email_verified) {
    //   await this.sendVerificationCodeByEmail(user.email);
    //   throw new UnauthorizedException();
    // }

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

    user.apiToken = signedToken.token;
    user.refreshToken = signedToken.refresh;

    // if (user.avatar) {
    //   user.avatar = await this._datastore.getObjectSignedUrl({
    //     bucket: this._config.get('store.usersBucket'),
    //     key: user.avatar,
    //   });
    // }

    return user;
  }

  async validateGoogleUser(googleUser: IUser) {
    const user = await this.findByEmail(googleUser.email);
    if (user) return user;
    return await this.createUser(googleUser);

  }

  async createUser(user: IUser) {
    const newUser = this.usersRepository.create(user);
    const savedUser = await this.usersRepository.save(newUser);
    return savedUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: {
        emails: {
          email: email,
        }
      }
    });
  }

  async findById(id: UUID): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: {
        id
      }
    });
  }

  async switchRole(userId: UUID, dto: SwitchRoleDto) {
    await this.usersRepository.update(userId, { role: dto.role });
    return { complete: true }
  }


}
