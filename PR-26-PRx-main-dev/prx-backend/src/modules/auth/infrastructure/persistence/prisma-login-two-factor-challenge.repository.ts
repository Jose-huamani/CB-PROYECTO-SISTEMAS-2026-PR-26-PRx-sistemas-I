import { Injectable } from '@nestjs/common';

import { LoginTwoFactorChallengeEntity } from '@modules/auth/domain/entities/login-two-factor-challenge.entity';
import { LoginTwoFactorChallengeRepository } from '@modules/auth/domain/repositories/login-two-factor-challenge.repository';
import { LoginTwoFactorChallengePrismaMapper } from '@modules/auth/infrastructure/mappers/login-two-factor-challenge-prisma.mapper';

import { BasePrismaRepository } from '@shared/infrastructure/persistence/base-prisma.repository';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaLoginTwoFactorChallengeRepository
  extends BasePrismaRepository
  implements LoginTwoFactorChallengeRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(
    entity: LoginTwoFactorChallengeEntity,
  ): Promise<LoginTwoFactorChallengeEntity> {
    const created = await this.prisma.loginTwoFactorChallenge.create({
      data: {
        userId: entity.userId,
        code: entity.code,
        expiresAt: entity.expiresAt,
        userAgent: entity.userAgent,
        ipAddress: entity.ipAddress,
      },
    });

    return LoginTwoFactorChallengePrismaMapper.toDomain(created);
  }

  async findValidByIdAndCode(
    id: string,
    code: string,
  ): Promise<LoginTwoFactorChallengeEntity | null> {
    const item = await this.prisma.loginTwoFactorChallenge.findFirst({
      where: {
        id,
        code,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!item) {
      return null;
    }

    return LoginTwoFactorChallengePrismaMapper.toDomain(item);
  }

  async invalidatePendingForUser(userId: number): Promise<void> {
    await this.prisma.loginTwoFactorChallenge.updateMany({
      where: {
        userId,
        usedAt: null,
      },
      data: {
        usedAt: new Date(),
      },
    });
  }

  async markAsUsed(id: string): Promise<void> {
    await this.prisma.loginTwoFactorChallenge.update({
      where: { id },
      data: {
        usedAt: new Date(),
      },
    });
  }
}
