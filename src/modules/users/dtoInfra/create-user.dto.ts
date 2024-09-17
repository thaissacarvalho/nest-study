import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDtoInfra {
	@IsString()
	@Length(3, 40)
	@ApiProperty()
	name: string;

	@IsEmail()
	@IsNotEmpty()
	@Length(4, 255)
	@ApiProperty()
	email: string;

	@IsNotEmpty()
	@Length(6, 32)
	@ApiProperty()
	password: string;
}
