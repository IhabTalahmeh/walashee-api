import { Module } from '@nestjs/common';
import { AdminAuthController } from './auth/controllers/admin.auth.controller';
import { AdminAuthService } from './auth/services/admin.auth.service';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { EntityLookupModule } from '../entity-lookup/entity-lookup.module';

@Module({
    imports: [
        UsersModule,
        AuthModule,
        EntityLookupModule,
    ],
    controllers: [
        AdminAuthController,
    ],
    providers: [
        AdminAuthService,
    ],
})
export class AdminModule {}
