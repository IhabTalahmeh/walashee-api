import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy } from 'src/common/strategies/google.strategy';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { AccessTokenGeneratorService } from './services/access-token-generator.service';
import { jwtOptions } from 'config/jwt-options.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilityService } from 'src/common/services/utility.service';
import { AccessToken, Address, Company, Country, PasswordResetCode, User, UserEmail, UserPhone } from 'src/typeorm/entities';
import { VerificationCode } from 'src/typeorm/entities/auth/verification-code.entity';
import { EntityLookupService } from '../entity-lookup/services/entity-lookup.service';
import { PasswordService } from './services/password.service';
import { CloudfrontService } from '../aws/services/cloudfront.service';
import { WhatsappService } from 'src/common/services/whatsapp.service';
import { VerificationService } from './services/verification.service';
import { Team } from 'src/typeorm/entities/common/team.entity';


@Module({
  imports: [
    JwtModule.registerAsync(jwtOptions),
    TypeOrmModule.forFeature([
      User,
      AccessToken,
      UserEmail,
      UserPhone,
      VerificationCode,
      Address,
      PasswordResetCode,
      Country,
      Company,
      Team,
    ]),
  ],
  providers: [
    AuthService,
    GoogleStrategy,
    JwtStrategy,
    AccessTokenGeneratorService,
    EntityLookupService,
    VerificationService,
    PasswordService,
    UtilityService,
    CloudfrontService,
    WhatsappService
  ],
  controllers: [AuthController],
  exports: [JwtStrategy, TypeOrmModule],
})
export class AuthModule { }
