import { Column, Entity, Index, PrimaryColumn } from "typeorm";
import { Timestamp } from "../common/timestamp.entity";
import type { UUID } from "crypto";
import { EIdentificationType } from "src/common/enum";
import { EGender } from "src/common/enum/gender.enum";


@Entity('user_identities')
export class UserIdentity extends Timestamp {

    @PrimaryColumn({ type: 'uuid' })
    @Index()
    id: UUID;

    @Column({
        type: 'enum',
        enum: EIdentificationType,
        nullable: false,
    })
    identificationType: EIdentificationType;

    @Column({ unique: true })
    idNumber: string;

    @Column({ unique: true, nullable: true })
    passportNumber: string;

    @Column()
    firstName: string;

    @Column()
    fatherName: string;

    @Column()
    grandfatherName: string;

    @Column()
    familyName: string;

    @Column()
    motherName: string;

    @Column({ type: 'date' })
    dateOfBirth: Date;

    @Column()
    placeOfBirth: string;

    @Column({
        type: 'enum',
        enum: EGender,
        nullable: false,
    })
    gender: EGender;

    @Column()
    placeOfIssue: string;

    @Column({ type: 'date' })
    dateOfIssue: Date;

    @Column({ type: 'date' })
    dateOfEnd: Date;
}