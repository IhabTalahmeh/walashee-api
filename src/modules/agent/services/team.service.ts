import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UUID } from "crypto";
import { CreateTeamDto } from "../dto/create-team.dto";
import { EntityLookupService } from "src/modules/entity-lookup/services/entity-lookup.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Team } from "src/typeorm/entities/common/team.entity";
import { In, Repository } from "typeorm";
import { UtilityService } from "src/common/services/utility.service";
import { instanceToPlain } from "class-transformer";
import { TeamInvitation } from "src/typeorm/entities/common/team-invitation.entity";
import { EInvitationStatus, ERoleType, ETeamRole } from "src/common/enum";
import { PhoneDto } from "src/modules/auth/dto/phone.dto";
import { getFullPhoneNumber, getListDto, removeLeadingZero } from "src/common/utils/utils";
import { ListDto } from "src/common/dto";
import { EInvitationType } from "src/common/enum/invitation-type.enum";
import { AwsService } from "src/modules/aws/services/aws.service";
import { AWSHelper } from "src/common/services/aws-helper.service";
import { CloudfrontService } from "src/modules/aws/services/cloudfront.service";
import { FCMService } from "src/modules/fcm/services/fcm.service";



@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private teamRepo: Repository<Team>,

    @InjectRepository(TeamInvitation)
    private teamInvitationRepo: Repository<TeamInvitation>,

    private cloudfrontService: CloudfrontService,
    private awsHelper: AWSHelper,
    private entityLookupService: EntityLookupService,
    private utility: UtilityService,
    private fcmService: FCMService,
  ) { }

  async getAgentTeams(userId: UUID) {
    const teams = await this.entityLookupService.findUserTeams(userId);
    if (teams) {
      return instanceToPlain(teams[0]);
    }
    return null;
  }

  async createTeam(ownerId: UUID, file: Buffer | null, dto: CreateTeamDto) {
    const team = await this.entityLookupService.findTeamByOwnerId(ownerId);
    const avatar = file ? `${Date.now()}.jpg` : undefined;

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
      avatar,
    });

    const saved = await this.teamRepo.save(created);

    if (file && avatar) {
      await this.awsHelper.uploadTeamAvatar(saved.id, file, avatar)
    }

    return saved;
  }

  async updateTeam(teamId: UUID, dto: CreateTeamDto) {
    const team = await this.teamRepo.update(teamId, dto);
    return instanceToPlain(team);
  }

  async getTeamById(teamId: UUID) {
    const team = await this.entityLookupService.findTeamById(teamId);
    if (team) {
      team.avatar = await this.cloudfrontService._getSignedUrl(`teams/${teamId}/avatar/small_${team.avatar}`);
    }
    return instanceToPlain(team);
  }

  async inviteAgentToTeam(inviterId: UUID, dto: PhoneDto, lang: string) {

    const fullPhoneNumber = getFullPhoneNumber(dto);
    const invitee = await this.entityLookupService.findUserByPhoneNumber(fullPhoneNumber);
    const inviter = await this.entityLookupService.findUserById(inviterId);

    if (!invitee) {
      throw new NotFoundException({
        code: "no-accounts-related-to-phone-number",
        message: "No account was found associated with this number",
      });
    }

    if (invitee.role !== ERoleType.CUSTOMER) {
      throw new BadRequestException({
        code: "cant-send-invitation",
        message: "You can't send this invitation",
      });
    }

    const team = await this.teamInvitationRepo.findOne({
      where: {
        inviter: { id: inviterId },
        invitee: { id: invitee.id },
        as: ETeamRole.AGENT,
      },
    });

    if (team?.status == EInvitationStatus.ACCEPTED) {
      throw new ConflictException({
        code: "agent-already-team-member",
        message: "Agent is alrady a member in your team",
      });
    } else if (team?.status == EInvitationStatus.PENDING || team?.status == EInvitationStatus.IN_REVIEW) {
      throw new ConflictException({
        code: "agent-already-invited",
        message: "Agent is already invited",
      });
    }

    const created = this.teamInvitationRepo.create({
      id: this.utility.generateUUID(),
      inviter: { id: inviter?.id },
      invitee: { id: invitee.id },
      as: ETeamRole.AGENT,
      status: EInvitationStatus.PENDING,
    });

    const saved = await this.teamInvitationRepo.save(created);

    await this.fcmService.sendTeamInvitationNotification(saved.id, lang);
    return saved;
  }

  async getTeamInvitations(userId: UUID, type: EInvitationType, listDto: ListDto) {
    const { page, size } = getListDto(listDto);

    let whereCondition: any;

    if (type === EInvitationType.SENT) {
      whereCondition = { inviter: { id: userId } };
    } else if (type === EInvitationType.RECEIVED) {
      whereCondition = { invitee: { id: userId } };
    } else {
      // Return both sent and received invitations
      whereCondition = [
        { inviter: { id: userId } },
        { invitee: { id: userId } },
      ];
    }

    const invitations = await this.teamInvitationRepo.find({
      where: whereCondition,
      relations: ['inviter', 'invitee'],
      skip: page,
      take: size,
    });

    return instanceToPlain(invitations);
  }

  async cancelTeamInvitation(userId: UUID, invitationId: UUID) {
    const pendingInvitation = await this.entityLookupService.findPendingTeamInvitatinById(invitationId, ['inviter']);

    if (!pendingInvitation) {
      throw new NotFoundException({
        code: "invitation-not-found",
        message: "Invitation not found",
      });
    }

    if (pendingInvitation.inviter.id !== userId) {
      throw new UnauthorizedException({
        code: "invitation-is-not-yours",
        message: "Invitation is not yours",
      });
    }

    await this.teamInvitationRepo.delete(pendingInvitation.id);
  }


}