import {
    Entity,
    Column,
    ManyToOne,
    Index,
    PrimaryColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Timestamp } from './timestamp.entity';
import { ENotificationType } from 'src/common/enum';
import type { UUID } from 'crypto';

@Entity('notifications')
export class Notification extends Timestamp {
    @PrimaryColumn('uuid')
    id: UUID;

    @Index()
    @ManyToOne(() => User, (user) => user.notifications, {
        onDelete: 'CASCADE',
        eager: false,
    })
    user: User;

    @Column({
        type: 'enum',
        enum: ENotificationType,
        nullable: false,
    })
    type: ENotificationType;

    @Column({ type: 'varchar', length: 500 })
    titleAr: string;

    @Column({ type: 'varchar', length: 500 })
    titleEn: string;

    @Column({ type: 'text', nullable: true })
    messageAr: string;

    @Column({ type: 'text', nullable: true })
    messageEn: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    event: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    screen: string;

    @Column({ type: 'json', nullable: true })
    params: Record<string, any>;

    @Column({ type: 'varchar', length: 255, nullable: true })
    deeplink: string;

    @Column({ type: 'boolean', default: false })
    isRead: boolean;
}
