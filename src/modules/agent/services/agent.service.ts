import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UUID } from "crypto";
import { EInvitationStatus, ETeamRole } from "src/common/enum";
import { UtilityService } from "src/common/services/utility.service";
import { EntityLookupService } from "src/modules/entity-lookup/services/entity-lookup.service";
import { TeamInvitation } from "src/typeorm/entities/common/team-invitation.entity";
import { Repository } from "typeorm";


@Injectable()
export class AgentService {
    constructor(
        @InjectRepository(TeamInvitation)
        private teamInvitationRepo: Repository<TeamInvitation>,

        private entityLookupService: EntityLookupService,

        private utility: UtilityService,
    ) { }


}