import { ENotificationType } from "../enum";

export interface INotification {
    type: ENotificationType,
    screen: string,
    params: object,
    titleAr: string,
    titleEn: string,
    messageAr: string,
    messageEn: string,
    event: string,
}