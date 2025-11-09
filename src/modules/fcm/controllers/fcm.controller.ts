import {
	Body,
	Controller,
	Delete,
	Get,
	Post,
	Req,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { FCMService } from '../services/fcm.service';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { RegisterFCMDto } from '../dto/register.dto';
import { IAccessTokenPayload } from 'src/common/types';
import { Roles } from 'src/common/decorators';
import { ERoleType } from 'src/common/enum';

@Controller('fcm')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class FcmController {
	constructor(private fcmService: FCMService) {}

	@Get('test')
	async getTestNotification(
		@Req() request,
	){
		const userId = request.user.sub;
		return this.fcmService.testNotification(userId);
	}

	@Post('register')
	registerForNotifications(
		@Req() request,
		@Body() registerFCMDto: RegisterFCMDto,
	) {
		const user = request.user as IAccessTokenPayload;
		return this.fcmService.registerForNotifications(
			registerFCMDto,
			user.sub,
		);
	}

	@Delete('unregister')
	unRegisterForNotifications(@Req() request) {
		const user = request.user as IAccessTokenPayload;
		return this.fcmService.unRegisterForNotifications(user.sub);
	}
}
