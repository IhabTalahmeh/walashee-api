import { IsEnum, IsOptional } from 'class-validator';
import { ListDto } from 'src/common/dto';
import { EInvitationType } from 'src/common/enum/invitation-type.enum';

export class TeamInvitationQueryDto extends ListDto {
  @IsEnum(EInvitationType)
  type: EInvitationType;
}
