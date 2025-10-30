import { Column, Entity, Index, PrimaryColumn } from "typeorm";
import type { UUID } from "crypto";
import { Timestamp } from "./timestamp.entity";

@Entity('locations')
@Index(['latitude', 'longitude'])
export class Location extends Timestamp {

    @PrimaryColumn({ type: 'uuid' })
    @Index()
    id: UUID;

    @Column({ type: 'decimal', precision: 9, scale: 6, nullable: false })
    latitude: number;

    @Column({ type: 'decimal', precision: 9, scale: 6, nullable: false })
    longitude: number;
}