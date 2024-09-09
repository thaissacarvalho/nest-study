import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDtoInfra {
	@IsString()
	@Length(3, 40)
	name: string;

	@IsEmail()
	@IsNotEmpty()
	@Length(4, 255)
	email: string;

	@IsNotEmpty()
	@Length(6, 32)
	password: string;
}
