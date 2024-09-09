import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { jwtConstants } from './constants';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private prisma: PrismaService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: jwtConstants.accessSecret,
		});
	}

	async validate(payload: any) {
		try {
			const user = await this.prisma.users.findUnique({
				where: { id: payload.sub },
			});

			if (!user) {
				throw new HttpException(
					'User not found or token invalid.',
					HttpStatus.UNAUTHORIZED,
				);
			}
			return user;
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.NOT_FOUND);
		}
	}
}
