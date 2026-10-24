import type { RefreshSessionService } from '../../session/services/refresh-session.service';
import type { User } from '../../user/entities/user.entity';
import type { UserService } from '../../user/services/user.service';
import type { AuthTokensDto } from '../dto/auth-tokens.dto';
import { SessionRenewalService } from './session-renewal.service';
import type { TokenIssuerService } from './token-issuer.service';

const user = { id: '00000000-0000-4000-8000-000000000009' } as User;
const tokens = { accessToken: 'signed.jwt.token' } as AuthTokensDto;
const rotated = { userId: user.id, token: { value: 'new-refresh', expiresAt: new Date() } };

interface Fixture {
  service: SessionRenewalService;
  sessionService: { rotate: jest.Mock; close: jest.Mock };
}

function createFixture(foundUser: User | null): Fixture {
  const usersService = { findActiveById: jest.fn().mockResolvedValue(foundUser) };
  const tokenIssuer = { buildTokens: jest.fn().mockResolvedValue(tokens) };
  const sessionService = {
    rotate: jest.fn().mockResolvedValue(rotated),
    close: jest.fn().mockResolvedValue(undefined),
  };
  const service = new SessionRenewalService(
    usersService as unknown as UserService,
    tokenIssuer as unknown as TokenIssuerService,
    sessionService as unknown as RefreshSessionService,
  );
  return { service, sessionService };
}

describe('SessionRenewalService', () => {
  it('renews the session of an active user', async () => {
    const { service } = createFixture(user);

    await expect(service.refresh({ refreshToken: 'old-refresh' })).resolves.toBe(tokens);
  });

  it('ends the session instead of renewing it when the user was deactivated', async () => {
    const { service, sessionService } = createFixture(null);

    await expect(service.refresh({ refreshToken: 'old-refresh' })).rejects.toMatchObject({
      response: { code: 'USER_INACTIVE' },
    });
    expect(sessionService.close).toHaveBeenCalledWith('new-refresh');
  });

  it('closes the session on logout', async () => {
    const { service, sessionService } = createFixture(user);

    await service.logout({ refreshToken: 'old-refresh' });

    expect(sessionService.close).toHaveBeenCalledWith('old-refresh');
  });
});
