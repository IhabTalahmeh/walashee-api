import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Patch,
	Req,
	UseGuards,
	UseInterceptors,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guard/jwt-auth.guard';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UsersService } from '../services/users.service';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe({
	transform: true,
	whitelist: true,
	forbidNonWhitelisted: true
}))
export class UsersController {
	constructor(private readonly usersService: UsersService) { }


	@Patch('me/profile')
	@ApiBody({
		description: 'Update user profile',
		type: UpdateProfileDto,
	})
	updateProfile(
		@Req() request,
		@Body() dto: UpdateProfileDto,
	) {
		const userId = request.user.sub;
		return this.usersService.updateProfile(userId, dto);
	}
}
