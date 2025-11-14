import { Module } from '@nestjs/common';
import { AgentService } from './services/agent.service';
import { AgentController } from './controllers/agent.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityLookupModule } from '../entity-lookup/entity-lookup.module';
import { UsersModule } from '../users/users.module';
import { UtilityService } from 'src/common/services/utility.service';
import { AwsModule } from '../aws/aws.module';
import { TeamController } from './controllers/team.controller';
import { TeamService } from './services/team.service';
import { AWSHelper } from 'src/common/services/aws-helper.service';
import { FcmModule } from '../fcm/fcm.module';
import { TeamInvitation, TeamInvitationRequest } from 'src/typeorm/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TeamInvitation,
      TeamInvitationRequest,
    ]),
    EntityLookupModule,
    UsersModule,
    AwsModule,
    FcmModule,
  ],
  providers: [
    AgentService,
    UtilityService,
    TeamService,
    AWSHelper,
  ],
  controllers: [
    AgentController,
    TeamController,
  ],
})
export class AgentModule { }
