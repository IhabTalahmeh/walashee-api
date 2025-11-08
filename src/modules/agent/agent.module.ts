import { Module } from '@nestjs/common';
import { AgentService } from './services/agent.service';
import { AgentController } from './controllers/agent.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamInvitation } from 'src/typeorm/entities/common/team-invitation.entity';
import { EntityLookupModule } from '../entity-lookup/entity-lookup.module';
import { UsersModule } from '../users/users.module';
import { UtilityService } from 'src/common/services/utility.service';
import { AwsModule } from '../aws/aws.module';
import { TeamController } from './controllers/team.controller';
import { TeamService } from './services/team.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TeamInvitation,
    ]),
    EntityLookupModule,
    UsersModule,
    AwsModule,
  ],
  providers: [
    AgentService,
    UtilityService,
    TeamService,
  ],
  controllers: [
    AgentController,
    TeamController,
  ],
})
export class AgentModule { }
