import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { apiError } from '../../../common/errors/api-error';
import type { EnvironmentVariables } from '../../../config/environment';
import type { RefreshToken } from '../entities/refresh-token.entity';
import {
  RefreshTokenRepository,
  type NewRefreshToken,
} from '../repository/refresh-token.repository';
import { judgeRefreshToken } from '../rules/refresh-rotation.rule';
import { generateTokenValue, hashTokenValue } from './token-secret';

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export interface IssuedRefreshToken {
  value: string;
  expiresAt: Date;
}

export interface RotatedRefreshToken {
  userId: string;
  token: IssuedRefreshToken;
}

interface TokenOwner {
  userId: string;
  familyId: string;
}

interface PreparedToken {
  token: IssuedRefreshToken;
  record: NewRefreshToken;
}

@Injectable()
export class RefreshSessionService {
  public constructor(
    private readonly repository: RefreshTokenRepository,
    private readonly config: ConfigService<EnvironmentVariables, true>,
  ) {}

  public async open(userId: string): Promise<IssuedRefreshToken> {
    const now = new Date();
    await this.repository.deleteExpired(now);
    const { token, record } = this.prepare({ userId, familyId: randomUUID() }, now);
    await this.repository.create(record);
    return token;
  }

  public async rotate(value: string): Promise<RotatedRefreshToken> {
    const now = new Date();
    const previous = await this.findOrReject(value);
    const verdict = judgeRefreshToken(previous, now);
    if (verdict === 'REUSED') {
      await this.repository.deleteFamily(previous.familyId);
    }
    if (verdict !== 'ROTATE') {
      throw this.invalidToken();
    }
    const { token, record } = this.prepare(previous, now);
    await this.repository.rotate(previous, record, now);
    return { userId: previous.userId, token };
  }

  public async close(value: string): Promise<void> {
    const record = await this.repository.findByHash(hashTokenValue(value));
    if (record) {
      await this.repository.deleteFamily(record.familyId);
    }
  }

  private async findOrReject(value: string): Promise<RefreshToken> {
    const record = await this.repository.findByHash(hashTokenValue(value));
    if (!record) {
      throw this.invalidToken();
    }
    return record;
  }

  private prepare(owner: TokenOwner, now: Date): PreparedToken {
    const days = this.config.get('REFRESH_TOKEN_EXPIRES_IN_DAYS', { infer: true });
    const value = generateTokenValue();
    const expiresAt = new Date(now.getTime() + days * MILLISECONDS_PER_DAY);
    const record = {
      userId: owner.userId,
      familyId: owner.familyId,
      tokenHash: hashTokenValue(value),
      expiresAt,
    };
    return { token: { value, expiresAt }, record };
  }

  private invalidToken(): UnauthorizedException {
    return new UnauthorizedException(
      apiError('INVALID_REFRESH_TOKEN', 'Sua sessão expirou. Entre novamente.'),
    );
  }
}
