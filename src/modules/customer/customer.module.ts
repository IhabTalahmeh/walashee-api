import { Module } from '@nestjs/common';
import { CustomerController } from './controllers/customer.controller';
import { CustomerService } from './services/customer.service';
import { EntityLookupModule } from '../entity-lookup/entity-lookup.module';
import { CustomerInvitationService } from './services/customer-invitation.service';
import { CustomerInvitationController } from './controllers/customer-invitation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamInvitationRequest } from 'src/typeorm/entities';
import { AwsModule } from '../aws/aws.module';
import { UtilityService } from 'src/common/services/utility.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            TeamInvitationRequest,
        ]),
        EntityLookupModule,
        AwsModule,
    ],
    controllers: [
        CustomerController,
        CustomerInvitationController,
    ],
    providers: [
        CustomerService,
        CustomerInvitationService,
        UtilityService,
    ],
    exports: [
        TypeOrmModule,
    ]
})
export class CustomerModule { }
