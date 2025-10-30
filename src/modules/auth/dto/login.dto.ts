import { IsEmail, IsNotEmpty } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginByEmailDto {
	@ApiProperty({ type: "string" })
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({ type: "string" })
	@IsNotEmpty()
	password: string;
}
