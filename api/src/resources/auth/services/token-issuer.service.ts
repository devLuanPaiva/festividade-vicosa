import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  RefreshSessionService,
  type IssuedRefreshToken,
} from '../../session/services/refresh-session.service';
import type { AuthTokensDto } from '../dto/auth-tokens.dto';

interface DecodedAccessToken {
  exp: number;
}

@Injectable()
export class TokenIssuerService {
  public constructor(
    private readonly jwtService: JwtService,
    private readonly sessionService: RefreshSessionService,
  ) {}

  public async startSession(userId: string): Promise<AuthTokensDto> {
    const refreshToken = await this.sessionService.open(userId);
    return this.buildTokens(userId, refreshToken);
  }

  public async buildTokens(
    userId: string,
    refreshToken: IssuedRefreshToken,
  ): Promise<AuthTokensDto> {
    const accessToken = await this.jwtService.signAsync({ sub: userId });
    const { exp } = this.jwtService.decode<DecodedAccessToken>(accessToken);
    return {
      accessToken,
      accessTokenExpiresAt: new Date(exp * 1000).toISOString(),
      refreshToken: refreshToken.value,
      refreshTokenExpiresAt: refreshToken.expiresAt.toISOString(),
    };
  }
}
