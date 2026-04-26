import { LoginTwoFactorChallengeEntity } from '@modules/auth/domain/entities/login-two-factor-challenge.entity';

type LoginTwoFactorChallengePrismaModel = {
  id: string;
  userId: number;
  code: string;
  expiresAt: Date;
  usedAt: Date | null;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: Date;
};

export class LoginTwoFactorChallengePrismaMapper {
  static toDomain(
    item: LoginTwoFactorChallengePrismaModel,
  ): LoginTwoFactorChallengeEntity {
    return new LoginTwoFactorChallengeEntity(
      item.id,
      item.userId,
      item.code,
      item.expiresAt,
      item.userAgent,
      item.ipAddress,
      item.usedAt,
      item.createdAt,
    );
  }
}
