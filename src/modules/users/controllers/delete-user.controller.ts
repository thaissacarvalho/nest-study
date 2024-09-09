import { Controller, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from '../user.service';
import { Users } from '@prisma/client';

@Controller('users/:id')
export class DeleteUserController {
	constructor(private userService: UserService) {}

	@Delete()
	async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<Users> {
		return await this.userService.deleteUser(id);
	}
}
