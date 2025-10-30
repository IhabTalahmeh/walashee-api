import { IsEnum } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ERoleType } from "src/common/enum";
import { EPublicRoleType } from "src/common/enum/public-role-type.enum";

export class SwitchRoleDto {
  @ApiProperty({ type: 'string' })
  @IsEnum(EPublicRoleType)
  role: ERoleType;
}