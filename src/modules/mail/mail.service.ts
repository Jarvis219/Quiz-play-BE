import { DOMAIN_FRONTEND } from '@/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendVerifyEmail({ email, token }: { email: string; token: string }) {
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
}
