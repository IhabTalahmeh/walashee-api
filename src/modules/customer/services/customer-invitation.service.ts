import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { instanceToPlain } from "class-transformer";
import { UUID } from "crypto";
import { ListDto } from "src/common/dto";
import { EInvitationStatus } from "src/common/enum";
import { getListDto } from "src/common/utils/utils";
import { TeamInvitation } from "src/typeorm/entities/common/team-invitation.entity";
import { In, Repository } from "typeorm";


@Injectable()
export class CustomerInvitationService {

    constructor(
        @InjectRepository(TeamInvitation)
        private teamInvitationRepo: Repository<TeamInvitation>
    ) { }

    async getTeamInvitations(userId: UUID, dto: ListDto) {
        const { page, size } = getListDto(dto);

        const invitations = await this.teamInvitationRepo
            .createQueryBuilder('invitation')
            .leftJoinAndSelect('invitation.inviter', 'inviter')
            .where('invitation.inviteeId = :userId', { userId })
            .andWhere('invitation.status IN (:...statuses)', {
                statuses: [EInvitationStatus.PENDING, EInvitationStatus.IN_REVIEW],
            })
            .select([
                'invitation',
                'inviter.id',
                'inviter.fullName',
                'inviter.avatar',
            ])
            .take(size)
            .skip(page)
            .getMany();


        return instanceToPlain(invitations);
    }
}