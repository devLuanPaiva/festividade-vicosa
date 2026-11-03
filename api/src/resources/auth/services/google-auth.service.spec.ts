import type { User } from '../../user/entities/user.entity';
import type { UserService } from '../../user/services/user.service';
import type { AuthTokensDto } from '../dto/auth-tokens.dto';
import { GoogleAuthService } from './google-auth.service';
import type { GoogleIdentityVerifier } from './google-identity-verifier.service';
import type { TokenIssuerService } from './token-issuer.service';

const user = { id: '00000000-0000-4000-8000-000000000009' } as User;
const tokens = { accessToken: 'signed.jwt.token' } as AuthTokensDto;
const request = { idToken: 'google.id.token', nonce: 'nonce' };

interface Fixture {
  service: GoogleAuthService;
  findActiveByEmail: jest.Mock;
  startSession: jest.Mock;
}

function createFixture(foundUser: User | null): Fixture {
  const verifier = {
    verify: jest.fn().mockResolvedValue({ email: 'ana@example.com', name: 'Ana' }),
  };
  const findActiveByEmail = jest.fn().mockResolvedValue(foundUser);
  const startSession = jest.fn().mockResolvedValue(tokens);
  const service = new GoogleAuthService(
    verifier as unknown as GoogleIdentityVerifier,
    { findActiveByEmail } as unknown as UserService,
    { startSession } as unknown as TokenIssuerService,
  );
  return { service, findActiveByEmail, startSession };
}

describe('GoogleAuthService', () => {
  it('starts a session for a Google e-mail that belongs to an active user', async () => {
    const { service, findActiveByEmail, startSession } = createFixture(user);

    await expect(service.login(request)).resolves.toBe(tokens);
    expect(findActiveByEmail).toHaveBeenCalledWith('ana@example.com');
    expect(startSession).toHaveBeenCalledWith(user.id);
  });

  it('blocks a Google e-mail that is not registered or is inactive', async () => {
    const { service, startSession } = createFixture(null);

    await expect(service.login(request)).rejects.toMatchObject({
      status: 403,
      response: { code: 'GOOGLE_EMAIL_NOT_AUTHORIZED' },
    });
    expect(startSession).not.toHaveBeenCalled();
  });
});
