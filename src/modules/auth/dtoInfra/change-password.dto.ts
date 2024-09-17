import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDTO {
	@IsString()
	@ApiProperty()
	oldPassword: string;

	@IsString()
	@MinLength(8)
	@MaxLength(32)
	@ApiProperty()
	newPassword: string;
}
