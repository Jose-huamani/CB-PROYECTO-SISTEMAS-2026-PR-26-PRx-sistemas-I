import { LoginTwoFactorChallengeEntity } from '@modules/auth/domain/entities/login-two-factor-challenge.entity';

export abstract class LoginTwoFactorChallengeRepository {
  abstract create(
    entity: LoginTwoFactorChallengeEntity,
  ): Promise<LoginTwoFactorChallengeEntity>;

  abstract findValidByIdAndCode(
    id: string,
    code: string,
  ): Promise<LoginTwoFactorChallengeEntity | null>;

  abstract invalidatePendingForUser(userId: number): Promise<void>;

  abstract markAsUsed(id: string): Promise<void>;
}
