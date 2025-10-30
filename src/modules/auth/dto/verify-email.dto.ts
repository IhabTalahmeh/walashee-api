import { IsEmail, IsNotEmpty, Matches } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class VerifyEmailDto {

    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    @IsEmail()
    @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    email: string;

    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    code: string;
}