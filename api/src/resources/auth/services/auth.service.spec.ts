import { UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { JwtService } from '@nestjs/jwt';
import type { PasswordHasher } from '../../user/services/password-hasher';
import type { User } from '../../user/entities/user.entity';
import type { UserService } from '../../user/services/user.service';
import { AuthService } from './auth.service';

const user = { id: 9, email: 'ana@example.com', passwordHash: randomUUID() } as User;
const credentials = { email: 'ana@example.com', password: randomUUID() };

function createFixture(foundUser: User | null, passwordMatches: boolean): AuthService {
  const usersService = { findActiveByEmail: jest.fn().mockResolvedValue(foundUser) };
  const passwordHasher = { verify: jest.fn().mockResolvedValue(passwordMatches) };
  const jwtService = { signAsync: jest.fn().mockResolvedValue('signed.jwt.token') };
  return new AuthService(
    usersService as unknown as UserService,
    passwordHasher as unknown as PasswordHasher,
    jwtService as unknown as JwtService,
  );
}

describe('AuthService', () => {
  it('returns an access token for valid credentials', async () => {
    const service = createFixture(user, true);

    await expect(service.login(credentials)).resolves.toEqual({ accessToken: 'signed.jwt.token' });
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
