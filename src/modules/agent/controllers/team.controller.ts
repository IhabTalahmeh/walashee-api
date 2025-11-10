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
    Query,
    UseInterceptors,
    UploadedFile
} from "@nestjs/common";
import type { UUID } from "crypto";
import { JwtAuthGuard } from "src/common/guard/jwt-auth.guard";
import { EntityOwnerGuard } from "src/common/guard/entity-owner.guard";
import { TeamService } from "../services/team.service";
import { CreateTeamDto } from "../dto/create-team.dto";
import { Roles } from "src/common/decorators";
import { ERoleType } from "src/common/enum";
import { PhoneDto } from "src/modules/auth/dto/phone.dto";
import { FileInterceptor } from '@nestjs/platform-express';
import { TeamInvitationQueryDto } from "../dto/team-invitation-query.dto";
import { ImageValidationPipe } from "src/common/validators/image.validator";
import { UtilityService } from "src/common/services/utility.service";

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
    @UseInterceptors(FileInterceptor('file'))
    async createTeam(
        @Req() request,
        @UploadedFile(ImageValidationPipe) file: Express.Multer.File,
        @Body() body: CreateTeamDto,
    ) {
        const userId = request.user.sub;
        const avatar = file?.buffer ? file.buffer : null;
        return this.teamService.createTeam(userId, avatar, body);
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


    @Patch(':teamId')
    @UseGuards(EntityOwnerGuard)
    async updateTeam(
        @Param('teamId') teamId: UUID,
        @Body() dto: CreateTeamDto,
    ) {
        return this.teamService.updateTeam(teamId, dto);
    }

    // Cancel invitation
    @Delete(':teamId/invitations/:invitationId')
    @UseGuards(EntityOwnerGuard)
    async deleteTeam(
        @Req() request,
        @Param('invitationId') invitationId: UUID,
    ) {
        const userId = request.user.sub;
        return this.teamService.cancelTeamInvitation(userId, invitationId);
    }
}
