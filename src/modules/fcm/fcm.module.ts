import { Module } from '@nestjs/common';
import { FCMService } from './services/fcm.service';
import { FcmController } from './controllers/fcm.controller';
import { FCMToken } from 'src/typeorm/entities/auth/fcm-tokens.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities';
import { UtilityService } from 'src/common/services/utility.service';
import { AwsModule } from '../aws/aws.module';
import { UsersModule } from '../users/users.module';
import { EntityLookupModule } from '../entity-lookup/entity-lookup.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([FCMToken, User]),
		AwsModule,
		UsersModule,
		EntityLookupModule,
	],
	providers: [FCMService, UtilityService],
	controllers: [FcmController],
	exports: [FCMService]
})
export class FcmModule {}
