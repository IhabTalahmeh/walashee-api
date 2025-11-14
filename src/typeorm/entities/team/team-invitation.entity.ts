import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import type { UUID } from "crypto";
import { User } from "../user/user.entity";
import { EInvitationStatus, ETeamRole } from "src/common/enum";
import { Timestamp } from "../common/timestamp.entity";
import { TeamInvitationRequest } from "./team-invitation-request.entity";

@Entity('team_invitations')
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

  @OneToOne(() => TeamInvitationRequest, request => request.invitation)
  request: TeamInvitationRequest;
}