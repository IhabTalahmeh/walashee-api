import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ResendPhoneCodeDto {

    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    fullPhoneNumber: 'string';
}