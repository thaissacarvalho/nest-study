import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDTO {
	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	refresh_token: string;
}
