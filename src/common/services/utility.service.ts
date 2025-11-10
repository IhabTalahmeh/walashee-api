import { UUID, randomBytes, randomInt, randomUUID } from 'crypto';
import { promisify } from 'util';

import { BadRequestException, Injectable } from '@nestjs/common';

import { compare, hash } from 'bcrypt';

import { ListDto } from '../dto/list.dto';

import axios from 'axios';
import { CloudfrontService } from 'src/modules/aws/services/cloudfront.service';
import { INotification } from '../interfaces';

@Injectable()
export class UtilityService {

	constructor(
		private cloudfrontService: CloudfrontService,
	) {

	}

	public async generateRandomString(size: number) {
		const randomBytesAsync = promisify(randomBytes);

		const value = await randomBytesAsync(size);
		return value.toString('base64');
	}

	public generateUUID(): UUID {
		return randomUUID();
	}

	public async hashPassword(password): Promise<string> {
		return hash(password, 10);
	}

	public async comparePassword(
		firstPassword,
		secondPassword,
	): Promise<boolean> {
		return compare(firstPassword, secondPassword);
	}

	public async getUniqueVerificationCode(): Promise<string> {
		const randomIntAsync = promisify<number, number>(randomInt);

		// Using 6-digit verification codes.
		const randomNumber = await randomIntAsync(1e6);

		let value = randomNumber.toString();

		if (value.length < 6) {
			const paddingLength = 6 - value.length;

			const padding = new Array(paddingLength).fill('0').join('');

			value = `${padding}${value}`;
		}

		return value;
	}

	public getSkippedItemsCount(dto: ListDto) {
		return (dto.page - 1) * dto.size;
	}

	public getRandomInt(min: number, max: number): number {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	public async fetchImageAsBuffer(url: string): Promise<Buffer> {
		try {
			const response = await axios.get(url, { responseType: 'arraybuffer' });
			return Buffer.from(response.data, 'binary');
		} catch (error) {
			throw new BadRequestException(`All urls must be valid images urls`);
		}
	}

	public async getProductAvatars(productId: UUID, fileName: string) {
		return {
			small: await this.cloudfrontService._getSignedUrl(`product-items/${productId}/avatar/small_${fileName}`),
			medium: await this.cloudfrontService._getSignedUrl(`product-items/${productId}/avatar/medium_${fileName}`),
			large: await this.cloudfrontService._getSignedUrl(`product-items/${productId}/avatar/large_${fileName}`),
			xlarge: await this.cloudfrontService._getSignedUrl(`product-items/${productId}/avatar/xlarge_${fileName}`),
		}
	}

	public buildNotificationPayload({ type, screen, params, titleAr, titleEn, messageAr, messageEn, event }: INotification) {
		return {
			type,
			screen,
			params: JSON.stringify(params || {}),
			titleAr,
			titleEn,
			messageAr,
			messageEn,
			event,
			deeplink: `walashee://${screen}`,
		};
	}


}
