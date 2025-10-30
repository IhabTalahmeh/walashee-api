import { Column, Entity, Index, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Timestamp } from "../common/timestamp.entity";
import type { UUID } from "crypto";
import { UserPhone } from "../user/user-phone.entity";
import { EContactType } from "src/common/enum/contact-type.enum";
import { UserEmail } from "../user/user-email.entity";


@Entity('verification_codes')
export class VerificationCode extends Timestamp {

    @PrimaryColumn({ type: 'uuid' })
    @Index()
    id: UUID;

    @OneToOne(() => UserEmail, userEmail => userEmail.id, { onDelete: 'CASCADE' })
    @JoinColumn()
    email: UserEmail;

    @OneToOne(() => UserPhone, userPhone => userPhone.id)
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

    @Column()
    expiresAt: Date;
}