import { IsNotEmpty, IsString } from '@nestjs/class-validator';

export class RefreshTokenDto {
	@IsNotEmpty()
	@IsString()
	refreshToken: string;
}
