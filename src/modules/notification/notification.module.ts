import { Module } from '@nestjs/common';
import { NotificationService } from './services/notification.service';
import { NotificationController } from './controllers/notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'src/typeorm/entities';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Notification,
        ])
    ],
    controllers: [NotificationController],
    providers: [NotificationService],
    exports: [TypeOrmModule],
})
export class NotificationModule {}
