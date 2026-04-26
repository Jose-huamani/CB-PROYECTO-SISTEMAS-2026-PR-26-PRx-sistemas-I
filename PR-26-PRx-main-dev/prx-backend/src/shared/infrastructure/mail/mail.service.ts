import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { join } from 'path';

import { baseLayout } from '@shared/infrastructure/mail/templates/layouts/base.layout';
import { APP_MESSAGES } from '@shared/constants/app-messages.constants';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: nodemailer.Transporter | null;
  private readonly from: string;
  private readonly logoPath: string;
  private readonly skipSend: boolean;

  constructor(private readonly configService: ConfigService) {
    this.skipSend =
      this.configService.get<boolean>('mail.skipSend') === true;

    this.logoPath = join(
      process.cwd(),
      'src',
      'shared',
      'infrastructure',
      'mail',
      'assets',
      'prx-logo.png',
    );

    if (this.skipSend) {
      this.from =
        this.configService.get<string>('mail.from')?.trim() ||
        'PRX Dev <noreply@local.test>';
      this.transporter = null;
      this.logger.warn(
        'MAIL_SKIP_SEND=true: SMTP desactivado; revisa la consola para códigos de correo.',
      );
      return;
    }

    this.from = this.configService.getOrThrow<string>('mail.from');

    const port = this.configService.getOrThrow<number>('mail.port');
    const secure = port === 465;

    this.transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow<string>('mail.host'),
      port,
      secure,
      requireTLS: !secure && port === 587,
      auth: {
        user: this.configService.getOrThrow<string>('mail.user'),
        pass: this.configService.getOrThrow<string>('mail.pass'),
      },
    });
  }

  async sendMail(
    to: string,
    subject: string,
    html: string,
    devNote?: string,
  ): Promise<void> {
    if (this.skipSend) {
      this.logger.warn(
        `[MAIL_SKIP_SEND] ${devNote ?? 'Correo omitido'} | Para: ${to} | ${subject}`,
      );
      return;
    }

    if (!this.transporter) {
      throw new InternalServerErrorException(APP_MESSAGES.MAIL_SEND_ERROR);
    }

    try {
      await this.transporter.sendMail({
        from: this.from,
        to,
        subject,
        html: baseLayout(html),
        attachments: [
          {
            filename: 'prx-logo.png',
            path: this.logoPath,
            cid: 'prx-logo',
          },
        ],
      });
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        const message =
          error instanceof Error ? error.message : String(error);
        this.logger.error(`Fallo al enviar correo a ${to}: ${message}`);
      }
      throw new InternalServerErrorException(APP_MESSAGES.MAIL_SEND_ERROR);
    }
  }
}
