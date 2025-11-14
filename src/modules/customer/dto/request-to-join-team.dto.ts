import { IsString } from '@nestjs/class-validator';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsValidDate } from 'src/common/validators/dateValidator';

export class RequestToJoinATeamDto {
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsNotEmpty()
    @IsValidDate()
    dateOfBirth: Date;

    @IsNotEmpty()
    docNumber: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    address: string;
}