import { Module } from '@nestjs/common';
import { CustomerController } from './controllers/customer.controller';
import { CustomerService } from './services/customer.service';
import { EntityLookupModule } from '../entity-lookup/entity-lookup.module';
import { CustomerInvitationService } from './services/customer-invitation.service';
import { CustomerInvitationController } from './controllers/customer-invitation.controller';

@Module({
    imports: [
        EntityLookupModule,
    ],
    controllers: [
        CustomerController,
        CustomerInvitationController,
    ],
    providers: [
        CustomerService,
        CustomerInvitationService,
    ]
})
export class CustomerModule {}
