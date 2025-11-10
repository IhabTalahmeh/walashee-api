import { Injectable, NotFoundException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { RegisterFCMDto } from '../dto/register.dto';
import { UUID } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { FCMToken } from 'src/typeorm/entities/auth/fcm-tokens.entity';
import { In, Repository } from 'typeorm';
import { UtilityService } from 'src/common/services/utility.service';
import { ENotificationType, ERoleType } from 'src/common/enum';
import { Notification } from 'src/typeorm/entities';
import { instanceToPlain } from 'class-transformer';
import { EntityLookupService } from 'src/modules/entity-lookup/services/entity-lookup.service';

@Injectable()
export class FCMService {
	constructor(
		@InjectRepository(FCMToken)
		private fcmRepository: Repository<FCMToken>,

		@InjectRepository(Notification)
		private notificationRepo: Repository<Notification>,

		private entityLookupService: EntityLookupService,
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

	async sendTeamInvitationNotification(invitationId: UUID) {

		const invitation = await this.entityLookupService.findPendingTeamInvitatinById(invitationId, ['inviter', 'invitee']);

		if (!invitation) {
			throw new NotFoundException({
				code: "invitation-not-found",
				message: "Invitation with this id does not exist",
			})
		}
		
		const fcmToken = await this.fcmRepository.findOne({
			where: { userId: invitation.invitee.id },
		});

		const payload = this.utility.buildNotificationPayload({
			type: ENotificationType.TEAM_INVITATION,
			screen: 'NotificationsScreen',
			params: {},
			titleAr: 'مرحبا',
			titleEn: 'hello',
			event: '',
			messageAr: 'هذا اشعار باللغة العربية',
			messageEn: 'This is a notification in english',
		});

		if (fcmToken) {
			await this.sendPushNotification(fcmToken.token, payload);
		}

		const created = this.notificationRepo.create({
			id: this.utility.generateUUID(),
			user: { id: invitation.invitee.id },
			...payload,
			params: payload.params ? JSON.parse(payload.params) : null,
		});

		const saved = await this.notificationRepo.save(created);

		return instanceToPlain(saved);
	}

}
