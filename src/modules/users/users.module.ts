import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtOptions } from 'config/jwt-options.config';
import { Address, Country, User, UserEmail, UserPhone } from '../../typeorm/entities';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { EntityLookupService } from '../entity-lookup/services/entity-lookup.service';
import { UtilityService } from 'src/common/services/utility.service';
import { EntityLookupModule } from '../entity-lookup/entity-lookup.module';
import { AuthModule } from '../auth/auth.module';
import { VerificationCode } from 'src/typeorm/entities/auth/verification-code.entity';
import { AwsModule } from '../aws/aws.module';

@Module({
	imports: [
		JwtModule.registerAsync(jwtOptions),
		TypeOrmModule.forFeature([
			User,
			Address,
			UserEmail,
			UserPhone,
			Country,
			VerificationCode,
		]),
		AuthModule,
		AwsModule,
	],
	controllers: [UsersController],
	providers: [UsersService, EntityLookupService, UtilityService],
})
export class UsersModule {}
