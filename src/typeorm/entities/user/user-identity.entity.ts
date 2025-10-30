import { Column, Entity, Index, PrimaryColumn } from "typeorm";
import { Timestamp } from "../common/timestamp.entity";
import type { UUID } from "crypto";


@Entity('user_identities')
export class UserIdentity extends Timestamp {

    @PrimaryColumn({type: 'uuid'})
    @Index()
    id: UUID;

    @Column()
    idNumber: string;

    @Column()
    firstName: string;

    @Column()
    fatherName: string;

    @Column()
    grandfatherName: string;

    @Column()
    motherName: string;

    @Column()
    dateOfBirth: Date;

    @Column()
    placeOfBirth: string;

    @Column()
    gender: string;

    @Column()
    placeOfIssue: string;

    @Column()
    dateOfIssue: Date;
}