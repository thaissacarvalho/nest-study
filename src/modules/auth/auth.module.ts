import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { jwtConstants } from './constants';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthController } from './controllers/auth.controller';
import { HashService } from 'src/utils/hash.service';
import { EmailModule } from '../email/email.module';

@Module({
	imports: [
		JwtModule.register({
			secret: jwtConstants.accessSecret,
			signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRATION },
		}),
		EmailModule,
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, PrismaService, HashService],
})
export class AuthModule {}
