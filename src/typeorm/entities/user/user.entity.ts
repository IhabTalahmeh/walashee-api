import type { UUID } from 'crypto';

import { Exclude } from 'class-transformer';
import {
	AfterLoad,
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
import { Notification } from 'src/typeorm/entities';
import { CloudfrontService } from 'src/modules/aws/services/cloudfront.service';
import { IAvatar } from 'src/common/interfaces/avatar.interface';

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

	@Column({
		type: 'enum',
		enum: ERoleType,
		default: ERoleType.CUSTOMER
	})
	useAs: ERoleType;

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

	@OneToMany(() => Notification, (notification) => notification.user)
	notifications: Notification[];

	apiToken: string;
	refreshToken: string;
	avatars?: IAvatar;

	@AfterLoad()
	async signAvatarUrl() {
		if (!this.avatar) {
			this.avatars = { small: null, medium: null, large: null };
			return;
		}

		try {
			const cloudfront = new CloudfrontService();

			const sizes: Array<keyof IAvatar> = ['small', 'medium', 'large'];
			const avatars: IAvatar = { small: null, medium: null, large: null };

			for (const size of sizes) {
				const path = this._getAvatarPath(size);
				avatars[size] = await cloudfront._getSignedUrl(path);
			}

			this.avatars = avatars;
		} catch (err) {
			console.error('Error signing CloudFront avatar URLs:', err);
			this.avatars = { small: null, medium: null, large: null };
		}
	}

	/**
	 * Helper to generate size-specific avatar path.
	 * Example:
	 *   avatars/user123/original.jpg → avatars/user123/medium-original.jpg
	 * Adjust to your naming convention as needed.
	 */
	private _getAvatarPath(size: string): string {
		if (!this.avatar) return '';
		return this.avatar.replace(/(\/)?([^/]+)$/, `$1${size}-$2`);
	}
}
