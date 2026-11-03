import { UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { PasswordHasher } from '../../user/services/password-hasher';
import type { User } from '../../user/entities/user.entity';
import type { UserService } from '../../user/services/user.service';
import type { AuthTokensDto } from '../dto/auth-tokens.dto';
import { AuthService } from './auth.service';
import type { TokenIssuerService } from './token-issuer.service';

const user = {
  id: '00000000-0000-4000-8000-000000000009',
  email: 'ana@example.com',
  passwordHash: randomUUID(),
} as User;

const credentials = { email: 'ana@example.com', password: randomUUID() };
const tokens = { accessToken: 'signed.jwt.token' } as AuthTokensDto;

function createFixture(foundUser: User | null, passwordMatches: boolean): AuthService {
  const usersService = { findActiveByEmail: jest.fn().mockResolvedValue(foundUser) };
  const passwordHasher = { verify: jest.fn().mockResolvedValue(passwordMatches) };
  const tokenIssuer = { startSession: jest.fn().mockResolvedValue(tokens) };
  return new AuthService(
    usersService as unknown as UserService,
    passwordHasher as unknown as PasswordHasher,
    tokenIssuer as unknown as TokenIssuerService,
  );
}

describe('AuthService', () => {
  it('returns the tokens for valid credentials', async () => {
    const service = createFixture(user, true);

    await expect(service.login(credentials)).resolves.toBe(tokens);
  });

  it('rejects a wrong password', async () => {
    const service = createFixture(user, false);

    await expect(service.login(credentials)).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects an unknown or inactive user with the same error as a wrong password', async () => {
    const service = createFixture(null, false);

    await expect(service.login(credentials)).rejects.toMatchObject({
      response: { code: 'INVALID_CREDENTIALS' },
    });
  });
});
