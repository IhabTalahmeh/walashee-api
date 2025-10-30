import { IsEmail, IsNotEmpty, IsString } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsPhoneNumber, IsUUID } from "class-validator";

export class BaseRegisterDto {

    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    password: string;
}

export class RegisterByEmailDto extends BaseRegisterDto {

    @ApiProperty({ type: 'string' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    lastName: string;

}

export class RegisterByMobileDto {

    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    number: string;

    @ApiProperty({type: 'string'})
    @IsNotEmpty()
    phoneCode: string;

}