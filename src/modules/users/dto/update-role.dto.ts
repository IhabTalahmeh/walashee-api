import { IsEnum } from '@nestjs/class-validator';
import { ERoleType } from 'src/common/enum';

export class UpdateUserRoleDto {
	@IsEnum(ERoleType)
	role: ERoleType;
}
