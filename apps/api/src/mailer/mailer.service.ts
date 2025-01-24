import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class CustomMailerService {
  constructor(private readonly mailService: MailerService) {}

  sendVerificationEmail(email: string, verificationCode: string) {
    return this.mailService.sendMail({
      from: `contact <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: `Email Verification Code`,
      template: './verification',
      context: { verificationCode },
    });
  }
}
