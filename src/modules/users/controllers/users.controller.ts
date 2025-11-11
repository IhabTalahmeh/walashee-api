import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Patch,
	Req,
	UploadedFile,
	UseGuards,
	UseInterceptors,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guard/jwt-auth.guard';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UsersService } from '../services/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from 'src/common/validators/image.validator';

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
	@UseInterceptors(FileInterceptor('file'))
	@ApiBody({
		description: 'Update user profile',
		type: UpdateProfileDto,
	})
	updateProfile(
		@Req() request,
		@Body() dto: UpdateProfileDto,
		@UploadedFile(ImageValidationPipe) file: Express.Multer.File,
	) {
		const userId = request.user.sub;
		const avatar = file?.buffer ? file.buffer : null;
		return this.usersService.updateProfile(userId, avatar, dto);
	}
}
