import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { RegisterFCMDto } from '../dto/register.dto';
import { UUID } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { FCMToken } from 'src/typeorm/entities/auth/fcm-tokens.entity';
import { In, Repository } from 'typeorm';
import { UtilityService } from 'src/common/services/utility.service';
import { ERoleType } from 'src/common/enum';

@Injectable()
export class FCMService {
	constructor(
		@InjectRepository(FCMToken)
		private fcmRepository: Repository<FCMToken>,

		private utility: UtilityService,
	) { }

	async registerForNotifications(
		registerFCMDto: RegisterFCMDto,
		userId: UUID,
	) {
		const tokenRecord = await this.fcmRepository.findOne({
			where: { userId },
		});

		if (tokenRecord) {
			await this.fcmRepository.update(
				{ id: tokenRecord.id },
				{ token: registerFCMDto.token },
			);
		} else {
			const createdTokenRecord = this.fcmRepository.create({
				id: this.utility.generateUUID(),
				userId: userId,
				token: registerFCMDto.token,
			});
			await this.fcmRepository.save(createdTokenRecord);
		}
		return true;
	}

	async unRegisterForNotifications(userId: UUID) {
		const tokenRecord = await this.fcmRepository.findOne({
			where: { userId },
		});
		if (tokenRecord) {
			await this.fcmRepository.delete({ id: tokenRecord.id });
		}
	}

	async sendPushNotification(token: string, dataPayload: any) {
		const message = {
			data: dataPayload,
			token: token,
			android: {
				priority: 'high' as const,
			},
			apns: {
				headers: {
					'apns-priority': '5',
				},
				payload: {
					aps: {
						'content-available': 1,
					},
				},
			},
		};

		try {
			const response = await admin.messaging().send(message);
			return response;
		} catch (error) {
			console.error('Error sending message:', error);
			throw error;
		}
	}

	async sendTeamInvitationNotification(userId: UUID) {
		const fcmTokens = await this.fcmRepository.find({
			where: { userId: userId },
		});
		const tokens = fcmTokens.map((item) => item.token);

		for (const token of tokens) {
			const dataPayload = {
				title: 'test',
				bodyEn: `Hello world`,
				bodyAr: `مرحبا بالعالم`,
				type: 'app',
				screen: 'CU_Main',
				params: JSON.stringify({}),
				event: 'on-join-request',
			};

			await this.sendPushNotification(token, dataPayload);
		}
	}

	async testNotification(userId: UUID) {
		const fcmTokens = await this.fcmRepository.find({
			where: { userId: userId },
		});
		const tokens = fcmTokens.map((item) => item.token);

		for (const token of tokens) {
			const dataPayload = {
				title: 'test',
				bodyEn: `Hello world`,
				bodyAr: `مرحبا بالعالم`,
				type: 'app',
				screen: 'CU_Main',
				params: JSON.stringify({}),
				event: 'on-join-request',
			};

			await this.sendPushNotification(token, dataPayload);
		}
	}

}
