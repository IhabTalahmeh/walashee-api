import { Module } from '@nestjs/common';
import { EntityLookupService } from './services/entity-lookup.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from 'src/typeorm/entities/common/team.entity';
import { TeamInvitation } from 'src/typeorm/entities/common/team-invitation.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Team,
            TeamInvitation,
        ]),
        UsersModule,
    ],
    providers: [EntityLookupService],
    exports: [
        EntityLookupService,
        TypeOrmModule,
    ],
})
export class EntityLookupModule { }
