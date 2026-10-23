import { UnauthorizedException, type ExecutionContext } from '@nestjs/common';
import type { Reflector } from '@nestjs/core';
import type { AuthenticatedRequest, AuthenticatedUser } from '../dto/authenticated-user.dto';
import type { AuthenticationService } from '../services/authentication.service';
import { JwtAuthGuard } from './jwt-auth.guard';

const authenticatedUser: AuthenticatedUser = {
  id: 1,
  name: 'Ana',
  email: 'ana@example.com',
  permissions: [],
};

function createContext(request: Partial<AuthenticatedRequest>): ExecutionContext {
  return {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

function createGuard(isPublic: boolean, authenticate = jest.fn()): JwtAuthGuard {
  return new JwtAuthGuard(
    { getAllAndOverride: jest.fn().mockReturnValue(isPublic) } as unknown as Reflector,
    { authenticate } as unknown as AuthenticationService,
  );
}

describe('JwtAuthGuard', () => {
  it('lets public routes through without a token', async () => {
    const guard = createGuard(true);

    await expect(guard.canActivate(createContext({ headers: {} }))).resolves.toBe(true);
  });

  it('attaches the authenticated user to the request', async () => {
    const guard = createGuard(false, jest.fn().mockResolvedValue(authenticatedUser));
    const request: Partial<AuthenticatedRequest> = { headers: { authorization: 'Bearer abc' } };

    await guard.canActivate(createContext(request));

    expect(request.user).toBe(authenticatedUser);
  });

  it('rejects a protected route without a bearer token', async () => {
    const guard = createGuard(false);

    await expect(guard.canActivate(createContext({ headers: {} }))).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
