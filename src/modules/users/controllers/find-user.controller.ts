import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from '../user.service';
import { Users } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Encontrar usuários')
@Controller('users')
export class FindsUserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	findAll(): Promise<Users[]> {
		return this.userService.findUsers();
	}

	@Get(':id')
	findOne(@Param('id') id: number): Promise<Users | null> {
		/* 
      const user = await this.userService.getUserById(Number(id));
      return user; 
    */
		return this.userService.findUserById(Number(id));
	}
}
