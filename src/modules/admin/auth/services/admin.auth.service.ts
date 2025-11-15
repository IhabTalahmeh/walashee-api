import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { AccessToken, User } from 'src/typeorm/entities';
import type { UUID } from "crypto";
import { instanceToPlain } from 'class-transformer';
import { IAccessTokenPayload } from 'src/common/types';
import { EVerificationStatusType } from 'src/common/enum/verification-status.enum';
import { VerificationCode } from 'src/typeorm/entities/auth/verification-code.entity';
import { EContactType } from 'src/common/enum/contact-type.enum';
import { EntityLookupService } from 'src/modules/entity-lookup/services/entity-lookup.service';
import { getFullPhoneNumber, removeLeadingZero } from 'src/common/utils/utils';
import { EVerificationPurpose } from 'src/common/enum/verification-purpose.enum';
import { LoginByMobileDto } from 'src/modules/auth/dto/login.dto';
import { AccessTokenGeneratorService } from 'src/modules/auth/services/access-token-generator.service';
import { PhoneDto } from 'src/modules/auth/dto/phone.dto';
import { VerificationService } from 'src/modules/auth/services/verification.service';
import { ERoleType } from 'src/common/enum';

@Injectable()
export class AdminAuthService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,

        @InjectRepository(AccessToken)
        private accessTokensRepository: Repository<AccessToken>,

        @InjectRepository(VerificationCode)
        private verificationCodeRepo: Repository<VerificationCode>,

        @InjectRepository(User)
        private usersRepo: Repository<User>,

        private entityLookupService: EntityLookupService,
        private accessTokenGenerator: AccessTokenGeneratorService,
        private verificationService: VerificationService,
    ) { }

    async getCurrentUser(userId: UUID) {
        const user = await this.entityLookupService.findUserById(userId);
        return instanceToPlain(user);
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
                    user: { role: ERoleType.ADMIN },
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

    async sendLoginCode(dto: PhoneDto) {
        const fullPhoneNumber = getFullPhoneNumber(dto);
        const user = await this.entityLookupService.findUserByPhoneNumber(fullPhoneNumber);

        if (user?.role !== ERoleType.ADMIN) {
            throw new UnauthorizedException("You are not an admin.");
        }

        await this.verificationService.sendLoginCode(dto);

        return { complete: true };
    }
}
