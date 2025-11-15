import type { UUID } from 'crypto';

import { Exclude } from 'class-transformer';
import {
    Column,
    Entity,
    Index,
    OneToOne,
    PrimaryGeneratedColumn,
    JoinColumn,
    ManyToOne
} from 'typeorm';
import { Timestamp } from '../common/timestamp.entity';
import { TeamInvitation } from './team-invitation.entity';
import { EInvitationStatus } from 'src/common/enum';
import { EInvitationRequestStatus } from 'src/common/enum/invitation-request-status.enum';
import { User } from '..';

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

    @ManyToOne(() => TeamInvitation, invitation => invitation.request, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn()
    invitation: TeamInvitation;

    @Column({
        type: 'enum',
        enum: EInvitationRequestStatus,
        default: EInvitationRequestStatus.PENDING,
    })
    status: EInvitationRequestStatus;

    @ManyToOne(() => User, { eager: true, nullable: true })
    @JoinColumn()
    processedBy: User | null;

    @Column({ type: 'timestamp', nullable: true })
    processedAt: Date | null;
}
