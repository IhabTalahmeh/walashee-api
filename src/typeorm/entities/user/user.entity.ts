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
	@Column({ default: null })
	password: string;

	@Column({ default: null })
	fullName: string;

	@Column({
		type: 'date',
		default: null,
	})
	dateOfBirth: Date;

	@Column({
		type: 'enum',
		enum: EGender,
		default: null,
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

	@Column({
		type: 'boolean',
		default: false,
	})
	verified: boolean;

	apiToken: string;
	refreshToken: string;

}
