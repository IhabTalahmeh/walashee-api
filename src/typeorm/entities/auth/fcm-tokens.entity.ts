import type { UUID } from 'crypto';

import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { Timestamp } from '../common/timestamp.entity';


@Entity({ name: 'fcm_tokens' })
export class FCMToken extends Timestamp {
	@PrimaryColumn({ type: 'uuid' })
	@Index()
	id: UUID;

	@Column({ type: 'uuid', unique: true })
	userId: UUID;

	@Column({ type: 'varchar' })
	token: string;
}
