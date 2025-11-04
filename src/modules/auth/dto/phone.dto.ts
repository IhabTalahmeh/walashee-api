import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class PhoneDto {

    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    phoneCode: string;

    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    number: string;
}