import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { JwtAuthGuard } from '../jwt.guard';
import { ChangePasswordDTO } from 'src/modules/auth/dtoInfra/change-password.dto';
import { ForgotPasswordDTO } from '../dtoInfra/forgot-password.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	async login(@Body() body: { email: string; password: string }) {
		return this.authService.login(
			await this.authService.validateUser(body.email, body.password),
		);
	}

	@UseGuards(JwtAuthGuard)
	@Post('access-token')
	getProfile(@Req() req) {
		return req.user;
	}

	@Post('refresh-token')
	async restartToken(@Body('refresh_token') refreshToken: string) {
		return this.authService.refreshToken(refreshToken);
	}

	@UseGuards(JwtAuthGuard)
	@Patch('change-password') // or change to @PUT
	async changePassword(
		@Body() changePasswordDTO: ChangePasswordDTO,
		@Req() req,
	) {
		const userId = req.user.id;
		return this.authService.changePassword(userId, changePasswordDTO);
	}

	@Post('forgot-password')
	async forgotPassword(@Body() forgotPasswordDTO: ForgotPasswordDTO) {
		return this.authService.forgotPassword(forgotPasswordDTO.email);
	}

	@Post('reset-password')
	async resetPassword(
		@Body('token') token: string,
		@Body('newPassword') newPassword: string,
	) {
		return await this.authService.resetPassword(token, newPassword);
	}
}
