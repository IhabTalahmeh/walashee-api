import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { instanceToPlain } from "class-transformer";
import { UUID } from "crypto";
import { ListDto } from "src/common/dto";
import { EInvitationStatus } from "src/common/enum";
import { getListDto } from "src/common/utils/utils";
import { EntityLookupService } from "src/modules/entity-lookup/services/entity-lookup.service";
import { In, Repository } from "typeorm";
import { RequestToJoinATeamDto } from "../dto/request-to-join-team.dto";
import { TeamInvitation, TeamInvitationRequest } from "src/typeorm/entities";
import { AWSHelper } from "src/common/services/aws-helper.service";
import { UtilityService } from "src/common/services/utility.service";
import { AwsService } from "src/modules/aws/services/aws.service";


@Injectable()
export class CustomerInvitationService {

    constructor(
        @InjectRepository(TeamInvitation)
        private teamInvitationRepo: Repository<TeamInvitation>,

        @InjectRepository(TeamInvitationRequest)
        private teamInvitationRequestRepo: Repository<TeamInvitationRequest>,

        private awsService: AwsService,
        private entityLookupService: EntityLookupService,
        private utility: UtilityService,
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

    async requestToJoinATeam(customerId: UUID, invitationId: UUID, doc: Buffer, dto: RequestToJoinATeamDto) {
        const invitation = await this.entityLookupService.findPendingTeamInvitationById(invitationId, ['inviter', 'invitee']);
        const fileName = doc ? `${Date.now()}.jpg` : undefined;
        if (!invitation) {
            throw new NotFoundException({
                code: 'invitation-not-found',
                message: "Invitation not found",
            });
        }

        if (invitation.invitee.id !== customerId) {
            throw new UnauthorizedException({
                code: 'invitation-is-not-yours',
                message: "Invitation is not yours",
            });
        }

        await this.awsService.uploadFile(`users/${customerId}/ids/${fileName}`, doc);
        const created = this.teamInvitationRequestRepo.create({
            id: this.utility.generateUUID(),
            ...dto,
            doc: fileName,
            invitation: { id: invitation.id },
        })

        const saved = await this.teamInvitationRequestRepo.save(created);

        return instanceToPlain(saved);
    }

}