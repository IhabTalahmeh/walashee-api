import { IsEmail } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export class ResendEmailCodeDto {

    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    @IsEmail()
    email: 'string';
}