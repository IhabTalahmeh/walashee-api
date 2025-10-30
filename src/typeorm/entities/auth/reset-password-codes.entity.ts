import type { UUID } from "crypto";
import { Entity, PrimaryColumn, ManyToOne, Column, Index } from "typeorm";
import { User } from "../user/user.entity";
import { Timestamp } from "../common/timestamp.entity";

@Entity('password_reset_codes')
export class PasswordResetCode extends Timestamp {
  @PrimaryColumn({ type: 'uuid' })
  @Index()
  id: UUID;

  @ManyToOne(() => User, user => user.id)
  user: User;

  @Column()
  code: string;

  @Column()
  expiresAt: Date;
}