import { Controller, Get, Param, Query, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ListDto } from "src/common/dto";
import { EntityOwnerGuard } from "src/common/guard/entity-owner.guard";
import { CustomerInvitationService } from "../services/customer-invitation.service";
import { Roles } from "src/common/decorators";
import { ERoleType } from "src/common/enum";
import { JwtAuthGuard } from "src/common/guard/jwt-auth.guard";
import type { UUID } from "crypto";
import { TeamInvitationQueryDto } from "src/modules/agent/dto/team-invitation-query.dto";

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

}