import { Column, Entity, Index, ManyToOne, PrimaryColumn } from "typeorm";
import { Timestamp } from "./timestamp.entity";
import type { UUID } from "crypto";
import { User } from "../user/user.entity";
import { EInvitationStatus, ETeamRole } from "src/common/enum";

@Entity('team_invitations')
@Index('unique_invitation_per_user', ['inviter', 'invitee', 'as'], { unique: true })
export class TeamInvitation extends Timestamp {

  @PrimaryColumn({ type: 'uuid' })
  id: UUID;

  @ManyToOne(() => User, user => user.id, { nullable: false })
  inviter: User;

  @ManyToOne(() => User, user => user.id, { nullable: false })
  invitee: User;

  @Column({
    type: 'enum',
    enum: ETeamRole,
    nullable: false,
  })
  as: ETeamRole;

  @Column({
    type: 'enum',
    enum: EInvitationStatus,
    nullable: false,
  })
  status: EInvitationStatus;
}