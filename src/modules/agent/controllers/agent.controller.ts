import { Controller, Param, Post, Req, UseGuards } from "@nestjs/common";
import type { UUID } from "crypto";
import { EntityOwnerGuard } from "src/common/guard/entity-owner.guard";
import { JwtAuthGuard } from "src/common/guard/jwt-auth.guard";
import { AgentService } from "../services/agent.service";


@Controller('agents')
@UseGuards(JwtAuthGuard)
export class AgentController {

    constructor(
        private agentService: AgentService,
    ) { }


}