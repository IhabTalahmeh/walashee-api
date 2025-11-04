import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { Timestamp } from "../common/timestamp.entity";
import type { UUID } from "crypto";
import { UserPhone } from "../user/user-phone.entity";
import { EContactType } from "src/common/enum/contact-type.enum";
import { UserEmail } from "../user/user-email.entity";
import { EVerificationPurpose } from "src/common/enum/verification-purpose.enum";


@Entity('verification_codes')
export class VerificationCode extends Timestamp {

    @PrimaryColumn({ type: 'uuid' })
    @Index()
    id: UUID;

    @ManyToOne(() => UserEmail, { onDelete: 'CASCADE' })
    @JoinColumn()
    email: UserEmail;

    @ManyToOne(() => UserPhone, { onDelete: 'CASCADE' })
    @JoinColumn()
    phone: UserPhone;

    @Column()
    code: string;

    @Column({
        type: 'enum',
        enum: EContactType,
        nullable: false
    })
    type: EContactType;

    @Column({
        type: 'enum',
        enum: EVerificationPurpose,
        nullable: false,
    })
    purpose: EVerificationPurpose;

    @Column()
    expiresAt: Date;
}