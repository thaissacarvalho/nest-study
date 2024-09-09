import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
	private transporter: nodemailer.Transporter;

	constructor() {
		this.initializeTransporter();
	}

	private async initializeTransporter() {
		// Create account on Ethereal
		const testAccount = await nodemailer.createTestAccount();
		console.log(testAccount);

		// Configure the (transporter) using Ethereal
		this.transporter = nodemailer.createTransport({
			host: testAccount.smtp.host,
			port: testAccount.smtp.port,
			secure: testAccount.smtp.secure,
			auth: {
				user: testAccount.user,
				pass: testAccount.pass,
			},
		});
	}

	async sendResetPasswordEmail(to: string, token: string) {
		const mailOptions = {
			from: '"Suporte" <noreply@yourdomain.com>',
			to,
			subject: 'Redefinição de senha',
			html: `<p>Você solicitou uma redefinição de senha. Clique no link abaixo para redefinir sua senha:</p>
             <a href="${process.env.FRONTEND_URL}/reset-password?token=${token}">Redefinir Senha</a>`,
		};

		const info = await this.transporter.sendMail(mailOptions);

		// Visualize in console.log for test.
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
	}
}
