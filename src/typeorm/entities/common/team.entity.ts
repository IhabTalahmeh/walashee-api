import { Column, Entity, Index, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Timestamp } from "./timestamp.entity";
import type { UUID } from "crypto";
import { User } from "../user/user.entity";


@Entity('teams')
export class Team extends Timestamp {

    @PrimaryColumn({ type: 'uuid' })
    @Index()
    id: UUID;

    @OneToOne(() => User, owner => owner.id, { nullable: false, eager: true })
    @JoinColumn()
    owner: User;

    @Column()
    name: string;

}