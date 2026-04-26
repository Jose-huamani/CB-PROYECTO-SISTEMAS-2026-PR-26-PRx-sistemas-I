import { Inject, Injectable } from '@nestjs/common';

import { AuthResponseMapper } from '@modules/auth/application/mappers/auth-response.mapper';
import { RefreshTokenEntity } from '@modules/auth/domain/entities/refresh-token.entity';
import { SessionEntity } from '@modules/auth/domain/entities/session.entity';
import { RefreshTokenRepository } from '@modules/auth/domain/repositories/refresh-token.repository';
import { SessionRepository } from '@modules/auth/domain/repositories/session.repository';
import { JwtTokenService } from '@modules/auth/infrastructure/adapters/jwt-token.service';
import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { JwtBasePayload } from '@shared/types/jwt-base-payload.type';

@Injectable()
export class CreateAuthSessionService {
  constructor(
    @Inject(SessionRepository)
    private readonly sessionRepository: SessionRepository,
    @Inject(RefreshTokenRepository)
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async createForUser(
    user: UserEntity,
    userAgent: string | null,
    ipAddress: string | null,
  ) {
    const payload: JwtBasePayload = {
      sub: user.id as number,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const session = await this.sessionRepository.create(
      new SessionEntity(null, user.id as number, userAgent, ipAddress),
    );

    const accessToken = await this.jwtTokenService.generateAccessToken(payload);
    const refreshToken =
      await this.jwtTokenService.generateRefreshToken(payload);

    const refreshExpiresAt =
      await this.jwtTokenService.calculateRefreshTokenExpiresAt();

    await this.refreshTokenRepository.create(
      new RefreshTokenEntity(
        null,
        session.id as string,
        refreshToken,
        refreshExpiresAt,
      ),
    );

    return AuthResponseMapper.toAuthResponse(user, accessToken, refreshToken);
  }
}
