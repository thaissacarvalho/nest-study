import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDTO {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	token: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	newPassword: string;
}
