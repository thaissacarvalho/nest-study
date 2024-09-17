import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(new ValidationPipe());

	const config = new DocumentBuilder()
		.setTitle('Nest Study - Users')
		.setDescription(
			'Essa é a API para treinar o uso do Nest.js com Prisma, além de treinar sobre Auth Guard, JWT, Passport e Bcrypt',
		)
		.setVersion('1.0')
		.addTag(
			'users, user, auth, jwt, passport, bcrypt, prisma, nest, postgresql, api',
		)
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	await app.listen(3000);
}
bootstrap();
