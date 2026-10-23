import type { AuthService } from '../services/auth.service';
import type { AuthenticatedUser } from '../dto/authenticated-user.dto';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  it('delegates the login to the auth service', async () => {
    const login = jest.fn().mockResolvedValue({ accessToken: 'signed.jwt.token' });
    const controller = new AuthController({ login } as unknown as AuthService);
    const credentials = { email: 'ana@example.com', password: 'a-long-password' };

    await expect(controller.login(credentials)).resolves.toEqual({
      accessToken: 'signed.jwt.token',
    });
    expect(login).toHaveBeenCalledWith(credentials);
  });

  it('returns the authenticated user as the current user', () => {
    const controller = new AuthController({} as unknown as AuthService);
    const user: AuthenticatedUser = {
      id: '00000000-0000-4000-8000-000000000001',
      name: 'Ana',
      email: 'ana@example.com',
      permissions: [],
    };

    expect(controller.currentUser(user)).toBe(user);
  });
});
