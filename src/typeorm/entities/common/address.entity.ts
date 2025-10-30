import { Column, Entity, Index, PrimaryColumn } from "typeorm";
import type { UUID } from "crypto";
import { Timestamp } from "./timestamp.entity";

@Entity('addresses')
export class Address extends Timestamp {

    @PrimaryColumn({ type: 'uuid' })
    @Index()
    id: UUID;

    @Column({ nullable: false })
    address1: string;

    @Column({ default: null })
    address2: string;

    @Column({ default: null })
    city: string;

    @Column({ default: null })
    street: string;

    @Column({ default: null })
    postalCode: string;

}