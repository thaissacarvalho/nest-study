import {
	ConflictException,
	HttpException,
	HttpStatus,
	Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDtoInfra } from './dtoInfra/create-user.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Users } from '@prisma/client';
import { HashService } from 'src/utils/hash.service';

@Injectable()
export class UserService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly hashService: HashService,
	) {}

	async findUsers(): Promise<Users[]> {
		try {
			const findAllUsers = await this.prisma.users.findMany();
			return findAllUsers;
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.NOT_FOUND);
		}
	}

	async findUserById(id: number): Promise<Users | null> {
		// Comparação para tipo de numero.
		if (typeof id !== 'number') {
			throw new HttpException(
				'ID must be a number',
				HttpStatus.BAD_REQUEST,
			);
		}

		// Procura pelo primeiro ID que achar com tal numero.
		try {
			return await this.prisma.users.findFirst({
				where: { id },
			});
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.NOT_FOUND);
		}
	}

	async createUser(createUser: CreateUserDtoInfra) {
		const { name, email, password } = createUser;

		// Validação de dados do DTO Infra
		const userDto = plainToClass(CreateUserDtoInfra, createUser);
		const errors = await validate(userDto);

		if (errors.length > 0) {
			throw new Error('Validation failed');
		}

		try {
			// Verifica a existencia de um usuário com aquele mesmo email.
			const existingUser = await this.prisma.users.findUnique({
				where: { email },
			});

			if (existingUser) {
				throw new HttpException(
					'Email already exists',
					HttpStatus.CONFLICT,
				);
			}

			// Hash da senha
			const hashedPassword =
				await this.hashService.hashPassword(password);

			return this.prisma.users.create({
				data: {
					name,
					email,
					password: hashedPassword,
				},
			});
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.CONFLICT);
		}
	}

	async deleteUser(id: number): Promise<Users> {
		const userExists = await this.prisma.users.findUnique({
			where: { id },
		});

		if (!userExists) {
			throw new HttpException(
				`This user ID: ${id} wasn't found.`,
				HttpStatus.NOT_FOUND,
			);
		}

		try {
			const userDeleted = await this.prisma.users.delete({
				where: { id },
			});

			return userDeleted;
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.GONE);
		}
	}
}
