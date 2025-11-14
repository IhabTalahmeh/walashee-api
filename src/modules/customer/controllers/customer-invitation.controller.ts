import { Body, Controller, Delete, Get, Param, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { ListDto } from "src/common/dto";
import { EntityOwnerGuard } from "src/common/guard/entity-owner.guard";
import { CustomerInvitationService } from "../services/customer-invitation.service";
import { Roles } from "src/common/decorators";
import { ERoleType } from "src/common/enum";
import { JwtAuthGuard } from "src/common/guard/jwt-auth.guard";
import type { UUID } from "crypto";
import { TeamInvitationQueryDto } from "src/modules/agent/dto/team-invitation-query.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { ImageValidationPipe } from "src/common/validators/image.validator";
import { RequestToJoinATeamDto } from "../dto/request-to-join-team.dto";

@UseGuards(JwtAuthGuard, EntityOwnerGuard)
@Roles(ERoleType.CUSTOMER)
@UsePipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
}))
@Controller('customers/:customerId/invitations')
export class CustomerInvitationController {

    constructor(
        private customerInvitationService: CustomerInvitationService,
    ) { }

    @Get()
    async getTeamInvitations(
        @Param('customerId') customerId: UUID,
        @Query() query: TeamInvitationQueryDto,
    ) {
        return this.customerInvitationService.getTeamInvitations(customerId, query);
    }

    @Delete(':invitationId')
    async rejectTeamInvitation(
        @Param('customerId') customerId: UUID,
        @Param('invitationId') invitationId: UUID,
    ) {
        return this.customerInvitationService.rejectTeamInvitation(customerId, invitationId);
    }

    @Post(':invitationId/requests')
    @UseInterceptors(FileInterceptor('file'))
    async requestToJoinATeam(
        @Param('customerId') customerId: UUID,
        @Param('invitationId') invitationId: UUID,
        @Body() dto: RequestToJoinATeamDto,
        @UploadedFile(new ImageValidationPipe(true)) file: Express.Multer.File,
    ) {
        return { message: 'hello world' };
        return this.customerInvitationService.requestToJoinATeam(customerId, invitationId, file?.buffer, dto);
    }

}