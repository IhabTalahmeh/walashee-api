import { Entity, Column, PrimaryColumn, Index } from 'typeorm';

import { Timestamp } from './timestamp.entity';
import type { UUID } from "crypto";

@Entity({ name: 'countries' })
export class Country extends Timestamp {

    @PrimaryColumn({ type: 'uuid' })
    @Index()
    id: UUID;

    @Column({ type: 'varchar', unique: true, nullable: true, length: 10 })
    iso: string;

    @Column({ type: 'varchar', unique: true, nullable: true, length: 10 })
    iso3: string;

    @Column({ type: 'varchar', unique: true, nullable: true, length: 128 })
    name: string;

    @Column({ type: 'varchar', unique: true, nullable: true, length: 128 })
    nameAR: string;

    @Column({ type: 'varchar', unique: false, nullable: true })
    phoneCode: string;

}
