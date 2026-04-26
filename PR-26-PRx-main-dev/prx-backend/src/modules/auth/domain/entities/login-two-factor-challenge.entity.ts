import { BaseEntity } from '@shared/domain/base.entity';

export class LoginTwoFactorChallengeEntity extends BaseEntity<string> {
  constructor(
    id: string | null,
    public readonly userId: number,
    public readonly code: string,
    public readonly expiresAt: Date,
    public readonly userAgent: string | null,
    public readonly ipAddress: string | null,
    public readonly usedAt?: Date | null,
    public readonly createdAt?: Date,
  ) {
    super(id);
  }
}
