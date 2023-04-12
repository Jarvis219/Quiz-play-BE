import { DOMAIN_FRONTEND } from '@/common';
import { ISendVerifyEmail } from '@/types';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendVerifyEmail({ email, token }: ISendVerifyEmail) {
    const urlVerify = `${DOMAIN_FRONTEND}/auth/confirm?token=${token}`;
    const domain = DOMAIN_FRONTEND;

    await this.mailerService.sendMail({
      to: email,

      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Quiz Play! Confirm your Email',
      template: './verify.email.hbs', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        domain,
        urlVerify,
      },
    });
  }

  async sendForgotPassword({ email, token }: ISendVerifyEmail) {
    const urlVerify = `${DOMAIN_FRONTEND}/auth/forgot-password?token=${token}`;
    const domain = DOMAIN_FRONTEND;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Quiz Play! Confirm your Email',
      template: './confirm-forgot-passwork.email.hbs',
      context: {
        domain,
        urlVerify,
      },
    });
  }
}
