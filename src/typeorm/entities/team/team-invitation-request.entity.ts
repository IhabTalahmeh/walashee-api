import type { UUID } from 'crypto';

import { Exclude } from 'class-transformer';
import {
    Column,
    Entity,
    Index,
    OneToOne,
    PrimaryGeneratedColumn,
    JoinColumn
} from 'typeorm';
import { Timestamp } from '../common/timestamp.entity';
import { TeamInvitation } from './team-invitation.entity';

@Entity('team_invitation_requests')
export class TeamInvitationRequest extends Timestamp {

    @PrimaryGeneratedColumn('uuid')
    @Index()
    id: UUID;

    @Column({ nullable: false })
    fullName: string;

    @Column({ type: 'date', default: null })
    dateOfBirth: Date;

    @Column({ nullable: false })
    docNumber: string;

    @Column({ nullable: false })
    email: string;

    @Column({ nullable: false })
    address: string;

    @Exclude()
    @Column({ nullable: false })
    doc: string;

    @OneToOne(() => TeamInvitation, invitation => invitation.request, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn()
    invitation: TeamInvitation;
}
