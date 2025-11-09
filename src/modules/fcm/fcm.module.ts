import { Module } from '@nestjs/common';
import { FCMService } from './services/fcm.service';
import { FcmController } from './controllers/fcm.controller';
import { FCMToken } from 'src/typeorm/entities/auth/fcm-tokens.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities';
import { UtilityService } from 'src/common/services/utility.service';
import { AwsModule } from '../aws/aws.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([FCMToken, User]),
		AwsModule,
	],
	providers: [FCMService, UtilityService],
	controllers: [FcmController],
})
export class FcmModule {}
