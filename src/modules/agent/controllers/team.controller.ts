import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Param,
    Body,
    UseGuards,
    ParseUUIDPipe,
    Req,
    ValidationPipe,
    UsePipes,
    Query
} from "@nestjs/common";
import type { UUID } from "crypto";
import { JwtAuthGuard } from "src/common/guard/jwt-auth.guard";
import { EntityOwnerGuard } from "src/common/guard/entity-owner.guard";
import { TeamService } from "../services/team.service";
import { CreateTeamDto } from "../dto/create-team.dto";
import { Roles } from "src/common/decorators";
import { ERoleType } from "src/common/enum";
import { PhoneDto } from "src/modules/auth/dto/phone.dto";
import { ListDto } from "src/common/dto";
import { EInvitationType } from "src/common/enum/invitation-type.enum";
import { TeamInvitationQueryDto } from "../dto/team-invitation-query.dto";

@UseGuards(JwtAuthGuard)
@Roles(ERoleType.AGENT)
@UsePipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true
}))
@Controller('agents/:agentId/teams')
export class TeamController {
    constructor(
        private readonly teamService: TeamService,
    ) { }


    @Get()
    @UseGuards(EntityOwnerGuard)
    async getAgentTeams(
        @Req() request,
    ) {
        const userId = request.user.sub;
        return this.teamService.getAgentTeams(userId);
    }

    // Create a new team for an agent
    @Post()
    @UseGuards(EntityOwnerGuard)
    async createTeam(
        @Req() request,
        @Body() body: CreateTeamDto,
    ) {
        const userId = request.user.sub;
        return this.teamService.createTeam(userId, body);
    }

    @Get(':teamId')
    @UseGuards(EntityOwnerGuard)
    async getTeamById(
        @Req() request,
        @Param('teamId') teamId: UUID,
    ) {
        const userId = request.user.sub;
        return this.teamService.getTeamById(teamId);
    }


    @Post(':teamId/invitations')
    @UseGuards(EntityOwnerGuard)
    async inviteAgentToTeam(
        @Req() request,
        @Body() dto: PhoneDto,
    ) {
        const userId = request.user.sub;
        return this.teamService.inviteAgentToTeam(userId, dto);
    }

    @Get(':teamId/invitations')
    @UseGuards(EntityOwnerGuard)
    async getTeamInvitations(
        @Req() request,
        @Query() query: TeamInvitationQueryDto,
    ) {
        const userId = request.user.sub;
        return this.teamService.getTeamInvitations(userId, query.type, query);
    }


    // Get all teams for an agent
    @Get()
    async getTeams(
        @Param('agentId') agentId: UUID,
    ) {
        // return this.teamService.getTeams(agentId);
    }

    // Get a specific team
    @Get(':teamId')
    async getTeam(
        @Param('agentId') agentId: UUID,
        @Param('teamId') teamId: UUID,
    ) {
        // return this.teamService.getTeam(agentId, teamId);
    }

    // Update a team
    @Patch(':teamId')
    @UseGuards(EntityOwnerGuard)
    async updateTeam(
        @Param('agentId') agentId: UUID,
        @Param('teamId') teamId: UUID,
        @Body() body: any,
    ) {
        // return this.teamService.updateTeam(agentId, teamId, body);
    }

    // Delete a team
    @Delete(':teamId')
    @UseGuards(EntityOwnerGuard)
    async deleteTeam(
        @Param('agentId') agentId: UUID,
        @Param('teamId') teamId: UUID,
    ) {
        // return this.teamService.deleteTeam(agentId, teamId);
    }
}
