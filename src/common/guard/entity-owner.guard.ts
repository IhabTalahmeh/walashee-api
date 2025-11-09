import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { EntityLookupService } from "src/modules/entity-lookup/services/entity-lookup.service";

@Injectable()
export class EntityOwnerGuard implements CanActivate {
  constructor(private entityLookupService: EntityLookupService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { user, params } = req;

    const { agentId, teamId } = params;

    if (agentId) {
      const agent = await this.entityLookupService.findUserById(agentId);
      if (!agent) throw new NotFoundException(`Agent ${agentId} not found`);
      if (agent.id !== user.sub)
        throw new UnauthorizedException(`You are not authorized as this agent`);
    }

    if (teamId) {
      const team = await this.entityLookupService.findTeamById(teamId);
      if (!team) throw new NotFoundException(`Team not found`);
      if (team.owner.id !== user.sub)
        throw new UnauthorizedException(`Team is not yours`);
    }

    return true;
  }
}
