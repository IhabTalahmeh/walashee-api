import { IsEmail } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export class AddEmailDto {

    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    @IsEmail()
    email: 'string';
}