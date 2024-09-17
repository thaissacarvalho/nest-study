import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { JwtAuthGuard } from '../jwt.guard';
import { ChangePasswordDTO } from 'src/modules/auth/dtoInfra/change-password.dto';
import { ForgotPasswordDTO } from '../dtoInfra/forgot-password.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AccessLoginDTO } from '../dtoInfra/access-login.dto';
import { RefreshTokenDTO } from '../dtoInfra/refresh-token.dto';
import { ResetPasswordDTO } from '../dtoInfra/reset-password.dto';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	@ApiBody({ type: AccessLoginDTO })
	async login(@Body() accessLoginDTO: AccessLoginDTO) {
		return this.authService.login(
			await this.authService.validateUser(
				accessLoginDTO.email,
				accessLoginDTO.password,
			),
		);
	}

	@UseGuards(JwtAuthGuard)
	@Post('access-token')
	@ApiBearerAuth()
	async getProfile(@Req() req) {
		return req.user;
	}

	@Post('refresh-token')
	@ApiBody({ type: RefreshTokenDTO })
	async restartToken(@Body('refresh_token') refreshToken: RefreshTokenDTO) {
		return this.authService.refreshToken(refreshToken.refresh_token);
	}

	@UseGuards(JwtAuthGuard)
	@Patch('change-password') // or change to @PUT
	@ApiBearerAuth()
	@ApiBody({ type: ChangePasswordDTO })
	async changePassword(
		@Body() changePasswordDTO: ChangePasswordDTO,
		@Req() req,
	) {
		const userId = req.user.id;
		return this.authService.changePassword(userId, changePasswordDTO);
	}

	@Post('forgot-password')
	@ApiBody({ type: ForgotPasswordDTO })
	async forgotPassword(@Body() forgotPasswordDTO: ForgotPasswordDTO) {
		return this.authService.forgotPassword(forgotPasswordDTO.email);
	}

	@Post('reset-password')
	@ApiBody({ type: ResetPasswordDTO })
	async resetPassword(@Body() resetPassword: ResetPasswordDTO) {
		const { token, newPassword } = resetPassword;
		return await this.authService.resetPassword(token, newPassword);
	}
}
