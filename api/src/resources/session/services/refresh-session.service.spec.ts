import { UnauthorizedException } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../../../config/environment';
import type { RefreshToken } from '../entities/refresh-token.entity';
import type {
  NewRefreshToken,
  RefreshTokenRepository,
} from '../repository/refresh-token.repository';
import { RefreshSessionService } from './refresh-session.service';
import { hashTokenValue } from './token-secret';

const USER_ID = '00000000-0000-4000-8000-000000000009';
const FAMILY_ID = '00000000-0000-4000-8000-0000000000aa';
const SEVEN_DAYS_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000;

function storedToken(changes: Partial<RefreshToken>): RefreshToken {
  return {
    id: 'token-id',
    userId: USER_ID,
    familyId: FAMILY_ID,
    tokenHash: hashTokenValue('stored'),
    expiresAt: new Date(Date.now() + SEVEN_DAYS_IN_MILLISECONDS),
    rotatedAt: null,
    createdAt: new Date(),
    ...changes,
  };
}

interface Fixture {
  service: RefreshSessionService;
  repository: Record<keyof RefreshTokenRepository, jest.Mock>;
}

function createFixture(found: RefreshToken | null): Fixture {
  const repository = {
    findByHash: jest.fn().mockResolvedValue(found),
    create: jest.fn().mockResolvedValue(undefined),
    rotate: jest.fn().mockResolvedValue(undefined),
    deleteFamily: jest.fn().mockResolvedValue(undefined),
    deleteExpired: jest.fn().mockResolvedValue(undefined),
  };
  const config = { get: jest.fn().mockReturnValue(7) };
  const service = new RefreshSessionService(
    repository as unknown as RefreshTokenRepository,
    config as unknown as ConfigService<EnvironmentVariables, true>,
  );
  return { service, repository };
}

describe('RefreshSessionService', () => {
  it('stores only the hash of a new refresh token', async () => {
    const { service, repository } = createFixture(null);

    const token = await service.open(USER_ID);

    const [record] = repository.create.mock.calls[0] as [NewRefreshToken];
    expect(record.tokenHash).toBe(hashTokenValue(token.value));
    expect(JSON.stringify(record)).not.toContain(token.value);
  });

  it('rotates a valid token inside the same family', async () => {
    const { service, repository } = createFixture(storedToken({}));

    const rotated = await service.rotate('stored');

    const [, next] = repository.rotate.mock.calls[0] as [RefreshToken, NewRefreshToken];
    expect(rotated.userId).toBe(USER_ID);
    expect(next.familyId).toBe(FAMILY_ID);
    expect(rotated.token.value).not.toBe('stored');
  });

  it('closes the whole family when a rotated token is replayed after the leeway', async () => {
    const replayed = storedToken({ rotatedAt: new Date(Date.now() - 60_000) });
    const { service, repository } = createFixture(replayed);

    await expect(service.rotate('stored')).rejects.toBeInstanceOf(UnauthorizedException);
    expect(repository.deleteFamily).toHaveBeenCalledWith(FAMILY_ID);
  });

  it('rejects an unknown token with the same error as an expired one', async () => {
    const unknown = createFixture(null);
    const expired = createFixture(storedToken({ expiresAt: new Date(Date.now() - 1000) }));

    await expect(unknown.service.rotate('x')).rejects.toMatchObject({
      response: { code: 'INVALID_REFRESH_TOKEN' },
    });
    await expect(expired.service.rotate('x')).rejects.toMatchObject({
      response: { code: 'INVALID_REFRESH_TOKEN' },
    });
    expect(expired.repository.deleteFamily).not.toHaveBeenCalled();
  });

  it('ends the session of a known token on logout and ignores unknown ones', async () => {
    const known = createFixture(storedToken({}));
    const unknown = createFixture(null);

    await known.service.close('stored');
    await unknown.service.close('nothing');

    expect(known.repository.deleteFamily).toHaveBeenCalledWith(FAMILY_ID);
    expect(unknown.repository.deleteFamily).not.toHaveBeenCalled();
  });
});
