import { Body, Controller, Get, Post, Put, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { GoogleAuthGuard } from 'src/common/guards/google-oauth/google-oauth.guard';
import { RegisterByEmailDto, RegisterByMobileDto } from '../dto/register.dto';
import { LoginByEmailDto } from '../dto/login.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { IAccessTokenPayload } from 'src/common/types';
import { VerificationService } from '../services/verification.service';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import { ResendEmailCodeDto } from '../dto/resend-email-code.dto';
import { AddEmailDto } from '../dto/add-email.dto';
import { PasswordService } from '../services/password.service';
import { ForgotEmailPasswordDto } from '../dto/forgot-email-password.dto';
import { SwitchRoleDto } from '../dto/switch-role.dto';
import { ResendPhoneCodeDto } from '../dto/resent-mobile-code.dto';

@UsePipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true
}))
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private verificationService: VerificationService,
        private passwordService: PasswordService
    ) { }

    // Token Endpoints

    @Put('token/refresh')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ description: 'Refresh the current access token' })
    refreshAccessToken(@Req() req, @Body() data: RefreshTokenDto) {
        const accessTokenPayload = req.user as IAccessTokenPayload;

        return this.authService.refreshAccessToken(
            accessTokenPayload,
            data.refreshToken,
        );
    }


    // Role Endpoints

    @Post('role/switch')
    @UseGuards(JwtAuthGuard)
    switchRole(
        @Req() request,
        @Body() dto: SwitchRoleDto
    ) {
        const userId = request.user.sub;
        return this.authService.switchRole(userId, dto)
    }


    // Register Endpoints

    @Post('register/mobile')
    registerByMobile(@Body() dto: RegisterByMobileDto) {
        return this.authService.registerByMobile(dto)
    }

    @Post('register/email')
    @UsePipes(new ValidationPipe({ transform: true }))
    registerByEmail(@Body() registerDto: RegisterByEmailDto) {
        return this.authService.registerByEmail(registerDto);
    }


    // Login Endpoints

    @Get('login/google')
    @UseGuards(GoogleAuthGuard)
    googleLogin() {

    }

    @Get('login/google/callback')
    @UseGuards(GoogleAuthGuard)
    async googleCallback(@Req() req, @Res() res) {
        const response = await this.authService.login(req?.user?.id);
        res.redirect(`http://localhost:3000/auth/test?apiToken=${response.apiToken}`);
    }

    @Post('login/email')
    @UsePipes(new ValidationPipe({ transform: true }))
    loginByEmail(@Body() loginDto: LoginByEmailDto) {
        return this.authService.loginByEmail(loginDto);
    }


    // Password Endpoints

    @Post('password/forgot/email')
    forgotEmailPassword(
        @Body() dto: ForgotEmailPasswordDto
    ) {
        return this.passwordService.forgotEmailPassword(dto);
    }

    @Post('password/forgot/mobile')
    forgotMobilePassword() {

    }

    @Post('password/reset/email')
    resetEmailPassword() {

    }

    @Post('password/reset/mobile')
    resetMobilePassword() {

    }


    // Verification Endpoints

    @Post('email/add')
    @UseGuards(JwtAuthGuard)
    addEmail(
        @Req() request,
        @Body() dto: AddEmailDto
    ) {
        const userId = request.user.sub;
        return this.verificationService.addEmail(dto, userId);
    }

    @Post('email/verify')
    verifyEmail(
        @Body() dto: VerifyEmailDto
    ) {
        return this.verificationService.verifyEmail(dto)
    }

    @Post('email/resend-code')
    resendEmailVerificationCode(
        @Body() dto: ResendEmailCodeDto
    ) {
        return this.verificationService.resendEmailVerificationCode(dto)
    }

    @Post('mobile/resend-code')
    resendMobileVerificationCode(
        @Body() dto: ResendPhoneCodeDto
    ) {
        return this.verificationService.resendMobileVerificationCode(dto)
    }

    @Post('mobile/verify')
    verifyMobile() { }

    @Post('mobile/add')
    addMobile() { }



}
