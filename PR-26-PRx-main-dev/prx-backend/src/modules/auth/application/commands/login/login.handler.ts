import { Inject, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { LoginCommand } from '@modules/auth/application/commands/login/login.command';
import { AUTH_CONSTANTS } from '@shared/constants/auth.constants';
import { AUTH_MESSAGES } from '@modules/auth/application/constants/auth-messages.constants';
import { LoginTwoFactorChallengeEntity } from '@modules/auth/domain/entities/login-two-factor-challenge.entity';
import { LoginTwoFactorChallengeRepository } from '@modules/auth/domain/repositories/login-two-factor-challenge.repository';
import { BcryptService } from '@modules/auth/infrastructure/adapters/bcrypt.service';
import { VerificationCodeService } from '@modules/auth/infrastructure/adapters/verification-code.service';
import { UserRepository } from '@modules/users/domain/repositories/user.repository';
import { MailService } from '@shared/infrastructure/mail/mail.service';
import { loginTwoFactorTemplate } from '@shared/infrastructure/mail/templates/auth/login-two-factor.template';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
    @Inject(LoginTwoFactorChallengeRepository)
    private readonly loginTwoFactorChallengeRepository: LoginTwoFactorChallengeRepository,
    private readonly bcryptService: BcryptService,
    private readonly verificationCodeService: VerificationCodeService,
    private readonly mailService: MailService,
  ) {}

  async execute(command: LoginCommand) {
    const { identifier, password } = command.dto;

    const user = identifier.includes('@')
      ? await this.userRepository.findByEmail(identifier)
      : await this.userRepository.findByUsername(identifier);

    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    const validPassword = await this.bcryptService.compare(
      password,
      user.passwordHash,
    );

    if (!validPassword) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    await this.loginTwoFactorChallengeRepository.invalidatePendingForUser(
      user.id as number,
    );

    const code = this.verificationCodeService.generateCode();
    const expiresAt = this.verificationCodeService.generateExpirationDate(
      AUTH_CONSTANTS.LOGIN_TWO_FACTOR.EXPIRES_MINUTES,
    );

    const challenge = await this.loginTwoFactorChallengeRepository.create(
      new LoginTwoFactorChallengeEntity(
        null,
        user.id as number,
        code,
        expiresAt,
        command.userAgent ?? null,
        command.ipAddress ?? null,
      ),
    );

    await this.mailService.sendMail(
      user.email,
      'Código de verificación — inicio de sesión',
      loginTwoFactorTemplate(code),
      `Código 2FA inicio de sesión: ${code}`,
    );

    return {
      message: AUTH_MESSAGES.LOGIN_TWO_FACTOR_SENT,
      data: {
        twoFactorRequired: true,
        challengeId: challenge.id as string,
      },
    };
  }
}
