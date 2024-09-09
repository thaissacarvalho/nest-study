import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserController } from './controllers/create-user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeleteUserController } from './controllers/delete-user.controller';
import { FindsUserController } from './controllers/find-user.controller';
import { HashService } from 'src/utils/hash.service';

@Module({
	controllers: [
		CreateUserController,
		DeleteUserController,
		FindsUserController,
	],
	providers: [UserService, PrismaService, HashService],
})
export class UserModule {}
