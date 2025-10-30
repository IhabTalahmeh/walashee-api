import { Column, Entity, PrimaryColumn } from "typeorm";
import { Timestamp } from "./timestamp.entity";
import type { UUID } from "crypto";


@Entity('companies')
export class Company extends Timestamp {

  @PrimaryColumn({ type: 'uuid' })
  id: UUID;

  @Column()
  nameAR: string;

  @Column()
  nameEN: string;

  @Column('json', { default: null })
  info: any;
}