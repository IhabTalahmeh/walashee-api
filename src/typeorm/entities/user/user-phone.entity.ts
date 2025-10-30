import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { Timestamp } from '../common/timestamp.entity';
import type { UUID } from "crypto";
import { User } from './user.entity';
import { EVerificationStatusType } from 'src/common/enum/verification-status.enum';
import { Country } from '../common/county.entity';

@Entity('user_phones')
export class UserPhone extends Timestamp {
    @PrimaryColumn({ type: 'uuid' })
    id: UUID;

    @ManyToOne(() => Country, country => country)
    country: Country;

    @Column()
    phoneCode: string;

    @Column()
    number: string;

    @ManyToOne(() => User, (user) => user.phones, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;

    @Column({
        type: 'enum',
        enum: EVerificationStatusType,
        default: EVerificationStatusType.NOT_VERIFIED,
    })
    status: EVerificationStatusType;

    @Column({
        type: 'boolean',
        default: false,
    })
    isPrimary: boolean;

    @Column({ unique: true })
    fullPhoneNumber: string;
}