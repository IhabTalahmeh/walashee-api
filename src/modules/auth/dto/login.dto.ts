import { IsEmail, IsNotEmpty } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class LoginByEmailDto {
	@ApiProperty({ type: "string" })
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({ type: "string" })
	@IsNotEmpty()
	password: string;
}

export class LoginByMobileDto {
	@ApiProperty({ type: "string" })
	@IsNotEmpty()
	phoneCode: string;

	@ApiProperty({ type: "string" })
	@IsNotEmpty()
	number: string;

	@ApiProperty({ type: "string" })
	@Length(6)
	@IsNotEmpty()
	code: string;
}
