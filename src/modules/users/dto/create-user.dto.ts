import { Email, ID, Name, Password } from 'src/types';

export interface CreateUserDto {
	id: ID;
	name: Name;
	email: Email;
	password: Password;
}
