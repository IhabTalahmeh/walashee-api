import type { UUID } from 'crypto';

import { Exclude } from 'class-transformer';
import {
	Column,
	Entity,
	Index,
	OneToMany,
	PrimaryColumn,
} from 'typeorm';
import { Timestamp } from '../common/timestamp.entity';

import { ERoleType } from 'src/common/enum/role-type.enum';
import { UserEmail } from './user-email.entity';
import { UserPhone } from './user-phone.entity';
import { EGender } from 'src/common/enum/gender.enum';
import { ELanguageCode } from 'src/common/enum';

@Entity('users')
export class User extends Timestamp {
	@PrimaryColumn({ type: 'uuid' })
	@Index()
	id: UUID;

	@OneToMany(() => UserEmail, (email) => email.user)
	emails: UserEmail[];

	@OneToMany(() => UserPhone, (phone) => phone.user)
	phones: UserPhone[];

	@Exclude()
	@Column()
	password: string;

	@Column({ nullable: false })
	fullName: string;

	@Column({
		type: 'enum',
		enum: EGender,
		nullable: false,
	})
	gender: EGender;

	@Column({
		type: 'enum',
		enum: ERoleType,
		default: ERoleType.CUSTOMER
	})
	role: ERoleType;

	@Column({ default: null })
	avatar: string;

	@Column({
		type: 'enum',
		enum: ELanguageCode,
		default: ELanguageCode.EN,
	})
	languageCode: ELanguageCode;

	apiToken: string;
	refreshToken: string;

}
