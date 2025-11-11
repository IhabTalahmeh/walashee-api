import { Controller, Get, Query, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { JwtAuthGuard } from "src/common/guard/jwt-auth.guard";
import { NotificationService } from "../services/notification.service";
import { ListDto } from "src/common/dto";

@Controller('notifications')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true
}))
export class NotificationController {

    constructor(
        private notificationService: NotificationService,
    ) { }

    @Get()
    async getNotifications(
        @Req() request,
        @Query() listDto: ListDto,
    ) {
        const userId = request.user.sub;
        return this.notificationService.getNotifications(userId, listDto);
    }
}