import { Exclude } from 'class-transformer';
import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class Timestamp {
	@Exclude()
	@CreateDateColumn({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP(6)',
	})
	createdAt: Date;

	@Exclude()
	@UpdateDateColumn({
		type: 'timestamp',
		onUpdate: 'CURRENT_TIMESTAMP(6)',
	})
	updatedAt: Date;

	@Exclude()
	@DeleteDateColumn({
		type: 'timestamp',
		default: () => null
	})
	deletedAt: Date;
}
