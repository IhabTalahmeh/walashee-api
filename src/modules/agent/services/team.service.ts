import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { UUID } from "crypto";
import { CreateTeamDto } from "../dto/create-team.dto";
import { EntityLookupService } from "src/modules/entity-lookup/services/entity-lookup.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Team } from "src/typeorm/entities/common/team.entity";
import { Repository } from "typeorm";
import { UtilityService } from "src/common/services/utility.service";
import { instanceToPlain } from "class-transformer";
import { TeamInvitation } from "src/typeorm/entities/common/team-invitation.entity";
import { EInvitationStatus, ETeamRole } from "src/common/enum";
import { PhoneDto } from "src/modules/auth/dto/phone.dto";
import { getFullPhoneNumber, removeLeadingZero } from "src/common/utils/utils";



@Injectable()
export class TeamService {
    constructor(
        @InjectRepository(Team)
        private teamRepo: Repository<Team>,

        @InjectRepository(TeamInvitation)
        private teamInvitationRepo: Repository<TeamInvitation>,


        private entityLookupService: EntityLookupService,
        private utility: UtilityService,
    ) { }

    async getAgentTeams(userId: UUID) {
        const teams = await this.entityLookupService.findUserTeams(userId);
        if (teams) {
            return instanceToPlain(teams[0]);
        }
        return null;
    }

    async createTeam(ownerId: UUID, dto: CreateTeamDto) {
        const team = await this.entityLookupService.findTeamByOwnerId(ownerId);

        if (team) {
            throw new ConflictException({
                code: "agent-already-has-team",
                message: "Agent already has a team",
            });
        }

        const created = this.teamRepo.create({
            id: this.utility.generateUUID(),
            name: dto.name,
            owner: { id: ownerId },
        });

        const saved = await this.teamRepo.save(created);

        return saved;
    }

    async getTeamById(teamId: UUID) {
        const team = await this.entityLookupService.findTeamById(teamId);
        return instanceToPlain(team);
    }

    async inviteAgentToTeam(inviterId: UUID, dto: PhoneDto) {

        const fullPhoneNumber = getFullPhoneNumber(dto);
        const invitee = await this.entityLookupService.findUserByPhoneNumber(fullPhoneNumber);
        const inviter = await this.entityLookupService.findUserById(inviterId);

        if (!invitee) {
            throw new NotFoundException("Invitee not found");
        }

        if (inviterId == invitee?.id) {
            throw new BadRequestException("You can't invite yourself");
        }

        const team = await this.teamInvitationRepo.findOne({
            where: {
                inviter: { id: inviterId },
                invitee: { id: invitee.id },
                as: ETeamRole.AGENT,
            },
        });

        if (team?.status == EInvitationStatus.ACCEPTED) {
            throw new ConflictException("Agent is alrady a member in your team");
        } else if (team?.status == EInvitationStatus.PENDING) {
            throw new ConflictException("Agent is already invited");
        }

        const created = this.teamInvitationRepo.create({
            id: this.utility.generateUUID(),
            inviter: { id: inviter?.id },
            invitee: { id: invitee.id },
            as: ETeamRole.AGENT,
            status: EInvitationStatus.PENDING,
        });

        const data = await this.teamInvitationRepo.save(created);
        return data;
    }
}