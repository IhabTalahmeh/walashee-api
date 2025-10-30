import { Column, Entity, Index, PrimaryColumn } from "typeorm";
import { Timestamp } from "../common/timestamp.entity";
import type { UUID } from "crypto";


@Entity('user_passports')
export class UserPassport extends Timestamp {

    @PrimaryColumn({ type: 'uuid' })
    @Index()
    id: UUID;

    @Column()
    fullName: string;

    @Column()
    nationality: string;

    @Column()
    motherName: string;

    @Column()
    gender: string;

    @Column()
    dateOfBirth: Date;

    @Column()
    placeOfBirth: string;

    @Column()
    idNumber: string;

    @Column()
    passportNumber: string;

    @Column()
    type: string;    

    @Column()
    dateOfIssue: Date;

    @Column()
    dateOfExpiry: Date;

    @Column()
    issuingAuthority: string;

    @Column()
    countryCode: string;

}