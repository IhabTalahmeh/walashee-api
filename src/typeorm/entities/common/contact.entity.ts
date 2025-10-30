import { Column, Entity, Index, ManyToOne, PrimaryColumn } from "typeorm";
import { Timestamp } from "./timestamp.entity";
import type { UUID } from "crypto";
import { Country } from "./county.entity";


@Entity('contacts')
export class Contact extends Timestamp {

    @PrimaryColumn({ type: 'uuid' })
    @Index()
    id: UUID;

    @Column({ nullable: false })
    email: string;

    @ManyToOne(() => Country, country => country.id, { nullable: false })
    country: Country;

    @Column()
    phoneNumber: string;

    @Column({ nullable: true })
    website: string;
}