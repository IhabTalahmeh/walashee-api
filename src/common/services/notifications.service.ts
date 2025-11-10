import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { ENotificationType } from '../enum';

@Injectable()
export class NotificationService {
  constructor(private readonly i18n: I18nService) {}

  buildTeamInvitation(invitation, lang: string) {
    const title = this.i18n.t('notification.team_invitation.title', { lang });
    const message = this.i18n.t('notification.team_invitation.message', {
      lang,
      args: {
        name: invitation.inviter.fullName,
        role: invitation.as,
      },
    });

    return {
      type: ENotificationType.TEAM_INVITATION,
      screen: 'NotificationsScreen',
      params: {},
      title,
      message,
    };
  }
}
