import { IsOptional, IsString } from '@nestjs/class-validator';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { EGender } from 'src/common/enum/gender.enum';
import { IsValidDate } from 'src/common/validators/dateValidator';

export class UpdateProfileDto {
	@IsString()
	@IsNotEmpty()
	fullName?: string;

	@IsNotEmpty()
	@IsValidDate()
	dateOfBirth: Date;

	@IsNotEmpty()
	@IsEnum(EGender)
	gender: EGender;
}