import type { UUID } from "crypto";

import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { Timestamp } from '../common/timestamp.entity';


@Entity('access_tokens')
export class AccessToken extends Timestamp {
	@PrimaryColumn({ type: 'uuid' })
	@Index()
	id: UUID;

	@Column({ type: Boolean, default: false })
	blacklisted: boolean;

	@Column({ type: Boolean, default: false })
	expired: boolean;

	@Column({ type: 'uuid' })
	userId: UUID;

	@Column({ type: String })
	refreshToken: string;
}
