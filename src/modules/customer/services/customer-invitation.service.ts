import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { instanceToPlain } from "class-transformer";
import { UUID } from "crypto";
import { ListDto } from "src/common/dto";
import { EInvitationStatus } from "src/common/enum";
import { getListDto } from "src/common/utils/utils";
import { EntityLookupService } from "src/modules/entity-lookup/services/entity-lookup.service";
import { TeamInvitation } from "src/typeorm/entities/common/team-invitation.entity";
import { In, Repository } from "typeorm";


@Injectable()
export class CustomerInvitationService {

    constructor(
        @InjectRepository(TeamInvitation)
        private teamInvitationRepo: Repository<TeamInvitation>,

        private entityLookupService: EntityLookupService,
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
                'inviter.gender',
                'inviter.avatar',
            ])
            .take(size)
            .skip(page)
            .getMany();


        return instanceToPlain(invitations);
    }

    async rejectTeamInvitation(userId: UUID, invitationId: UUID) {
        const pendingInvitation = await this.entityLookupService.findPendingTeamInvitationById(invitationId, ['invitee']);

        if (!pendingInvitation) {
            throw new NotFoundException({
                code: "invitation-not-found",
                message: "Invitation not found",
            });
        }

        if (pendingInvitation.invitee.id !== userId) {
            throw new UnauthorizedException({
                code: "invitation-is-not-yours",
                message: "Invitation is not yours",
            });
        }

        await this.teamInvitationRepo.delete(pendingInvitation.id);
    }

}