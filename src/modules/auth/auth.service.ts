import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashService } from 'src/utils/hash.service';
import { ChangePasswordDTO } from './dtoInfra/change-password.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
		private hashService: HashService,
		private emailService: EmailService,
	) {}

	async validateUser(email: string, password: string): Promise<any> {
		try {
			const user = await this.prisma.users.findUnique({
				where: { email },
			});

			if (
				user &&
				(await this.hashService.comparePassword(
					password,
					user.password,
				))
			) {
				const { password, ...result } = user;
				return result;
			}
		} catch (error) {
			throw new HttpException(
				'Error to validate user',
				HttpStatus.BAD_REQUEST,
			);
		}
	}

	async login(user: any) {
		try {
			const payload = { email: user.email, sub: user.id };
			return {
				access_token: this.jwtService.sign(payload, {
					secret: process.env.JWT_ACCESS_SECRET,
					expiresIn: process.env.JWT_ACCESS_EXPIRATION,
				}),
				refresh_token: this.jwtService.sign(payload, {
					secret: process.env.JWT_REFRESH_SECRET,
					expiresIn: process.env.JWT_REFRESH_EXPIRATION,
				}),
			};
		} catch (error) {
			throw new HttpException('Error to login', HttpStatus.UNAUTHORIZED);
		}
	}

	async refreshToken(refreshToken: string) {
		try {
			// Verify refresh token
			const decoded = this.jwtService.verify(refreshToken, {
				secret: process.env.JWT_REFRESH_SECRET,
			});

			// Search user
			const user = await this.prisma.users.findUnique({
				where: { id: decoded.sub },
			});

			if (!user) {
				throw new HttpException(
					'Invalid refresh token',
					HttpStatus.UNAUTHORIZED,
				);
			}

			// Access email and id for payload.
			const payload = { email: user.email, sub: user.id };

			// return new access token and refresh token
			return {
				access_token: this.jwtService.sign(payload, {
					secret: process.env.JWT_ACCESS_SECRET,
					expiresIn: process.env.JWT_ACCESS_EXPIRATION,
				}),
				refresh_token: this.jwtService.sign(payload, {
					secret: process.env.JWT_REFRESH_SECRET,
					expiresIn: process.env.JWT_REFRESH_EXPIRATION,
				}),
			};
		} catch (error) {
			throw new HttpException(
				'Invalid refresh token',
				HttpStatus.UNAUTHORIZED,
			);
		}
	}

	async changePassword(userId: number, changePasswordDTO: ChangePasswordDTO) {
		//
		const { oldPassword, newPassword } = changePasswordDTO;

		// Search user
		const user = await this.prisma.users.findUnique({
			where: { id: userId },
		});

		if (!user) {
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		}

		// Compare oldPassword with newPassword
		const comparePassword = await this.hashService.comparePassword(
			oldPassword,
			user.password,
		);

		if (!comparePassword) {
			throw new HttpException('Password is wrong.', HttpStatus.FORBIDDEN);
		}

		// Change user's password (MAKE THE HASH)
		const newHashedPassword =
			await this.hashService.hashPassword(newPassword);

		return await this.prisma.users.update({
			where: { id: userId },
			data: { password: newHashedPassword },
		});
	}

	async forgotPassword(email: string) {
		const user = await this.prisma.users.findUnique({
			where: { email },
		});

		if (!user) {
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		}

		const token = this.jwtService.sign(
			{ id: user.id },
			{
				expiresIn: '1h',
			},
		);

		await this.emailService.sendResetPasswordEmail(user.email, token);

		return {
			message: 'The password reset email has been sent.',
			token: token,
		};
	}

	async resetPassword(token: string, newPassword: string): Promise<any> {
		try {
			const decoded = this.jwtService.verify(token);
			const user = await this.prisma.users.findUnique({
				where: {
					id: decoded.id,
				},
			});

			if (!user) {
				throw new HttpException('User not found', HttpStatus.NOT_FOUND);
			}

			const hashedPassword =
				await this.hashService.hashPassword(newPassword);

			await this.prisma.users.update({
				where: { id: user.id },
				data: { password: hashedPassword },
			});

			return { message: 'Password redefined.' };
		} catch (error) {
			throw new HttpException(
				'Token invalid or expired.',
				HttpStatus.BAD_REQUEST,
			);
		}
	}
}
