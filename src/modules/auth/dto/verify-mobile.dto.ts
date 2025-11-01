import { IsEmail, IsNotEmpty, Matches } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class VerifyPhoneDto {

    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    number: string;

    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    phoneCode: string;

    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    code: string;
}