import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Timestamp } from '../common/timestamp.entity';
import type { UUID } from "crypto";
import { User } from './user.entity';
import { EVerificationStatusType } from 'src/common/enum/verification-status.enum';

@Entity('user_emails')
export class UserEmail extends Timestamp {
    @PrimaryColumn({ type: 'uuid' })
    id: UUID;

    @Column({ unique: true })
    email: string;

    @ManyToOne(() => User, (user) => user.emails, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;

    @Column({
        type: 'enum',
        enum: EVerificationStatusType,
        default: EVerificationStatusType.NOT_VERIFIED,
    })
    status: EVerificationStatusType;
}