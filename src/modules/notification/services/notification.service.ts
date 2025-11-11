import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { instanceToPlain } from "class-transformer";
import { UUID } from "crypto";
import { ListDto } from "src/common/dto";
import { getListDto } from "src/common/utils/utils";
import { Notification } from "src/typeorm/entities";
import { Repository } from "typeorm";


@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification)
        private notificationRepo: Repository<Notification>,
    ) { }

    async getNotifications(userId: UUID, dto: ListDto) {
        const { page, size } = getListDto(dto);

        const notifications = await this.notificationRepo.find({
            where: {
                user: { id: userId },
            },
            take: size,
            skip: page,
        });

        return instanceToPlain(notifications);
    }
}