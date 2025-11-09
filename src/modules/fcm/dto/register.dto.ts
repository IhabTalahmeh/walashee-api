import { IsNotEmpty, IsString } from '@nestjs/class-validator';

export class RegisterFCMDto {
	@IsNotEmpty()
	@IsString()
	token: string;
}
