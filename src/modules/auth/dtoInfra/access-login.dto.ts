import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AccessLoginDTO {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	email: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	password: string;
}
