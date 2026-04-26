import { Inject, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { VerifyLoginTwoFactorCommand } from '@modules/auth/application/commands/verify-login-two-factor/verify-login-two-factor.command';
import { AUTH_MESSAGES } from '@modules/auth/application/constants/auth-messages.constants';
import { CreateAuthSessionService } from '@modules/auth/infrastructure/adapters/create-auth-session.service';
import { LoginTwoFactorChallengeRepository } from '@modules/auth/domain/repositories/login-two-factor-challenge.repository';
import { UserRepository } from '@modules/users/domain/repositories/user.repository';
import { normalizeVerificationCode } from '@shared/utils/verification-code.util';

@CommandHandler(VerifyLoginTwoFactorCommand)
export class VerifyLoginTwoFactorHandler
  implements ICommandHandler<VerifyLoginTwoFactorCommand>
{
  constructor(
    @Inject(LoginTwoFactorChallengeRepository)
    private readonly loginTwoFactorChallengeRepository: LoginTwoFactorChallengeRepository,
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly createAuthSessionService: CreateAuthSessionService,
  ) {}

  async execute(command: VerifyLoginTwoFactorCommand) {
    const { challengeId, code } = command.dto;
    const normalizedCode = normalizeVerificationCode(code);

    const challenge =
      await this.loginTwoFactorChallengeRepository.findValidByIdAndCode(
        challengeId,
        normalizedCode,
      );

    if (!challenge) {
      throw new UnauthorizedException(AUTH_MESSAGES.LOGIN_TWO_FACTOR_INVALID);
    }

    const user = await this.userRepository.findById(challenge.userId);

    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.LOGIN_TWO_FACTOR_INVALID);
    }

    await this.loginTwoFactorChallengeRepository.markAsUsed(challengeId);

    const data = await this.createAuthSessionService.createForUser(
      user,
      challenge.userAgent,
      challenge.ipAddress,
    );

    return {
      message: AUTH_MESSAGES.LOGIN_SUCCESS,
      data,
    };
  }
}
