import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../user.service';
import { CreateUserDtoInfra } from '../dtoInfra/create-user.dto';

// A URL é "/users"
@Controller('users')
export class CreateUserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	// Criação de User pedindo que seja respondido no Body, pegando os dados necessários e validados em CreateUserDTOInfra.
	async create(@Body() createUserDto: CreateUserDtoInfra) {
		return await this.userService.createUser(createUserDto);
	}
}
