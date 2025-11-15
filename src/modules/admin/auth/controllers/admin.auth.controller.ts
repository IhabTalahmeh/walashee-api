import { Body, Controller, Get, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { LoginByMobileDto } from 'src/modules/auth/dto/login.dto';
import { PhoneDto } from 'src/modules/auth/dto/phone.dto';
import { RefreshTokenDto } from 'src/modules/auth/dto/refresh-token.dto';
import { VerificationService } from 'src/modules/auth/services/verification.service';
import { AdminAuthService } from '../services/admin.auth.service';

@UsePipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true
}))
@ApiTags('Authentication')
@Controller('admin/auth')
export class AdminAuthController {

    constructor(
        private adminAuthService: AdminAuthService,
        private verificationService: VerificationService,
    ) { }

    // Token Endpoints

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getCurrentUser(
        @Req() request,
    ) {
        const userId = request.user.sub;
        return this.adminAuthService.getCurrentUser(userId);
    }

    @Put('token/refresh')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ description: 'Refresh the current access token' })
    refreshAccessToken(@Req() request, @Body() data: RefreshTokenDto) {
        const userId = request.user;
        return this.adminAuthService.refreshAccessToken(
            userId,
            data.refreshToken,
        );
    }


    @Post('login/mobile')
    loginByPhone(@Body() dto: LoginByMobileDto) {
        return this.adminAuthService.loginByPhone(dto);
    }

    @Post('mobile/send-login-code')
    sendLoginCode(
        @Body() dto: PhoneDto
    ) {
        return this.adminAuthService.sendLoginCode(dto)
    }


}
