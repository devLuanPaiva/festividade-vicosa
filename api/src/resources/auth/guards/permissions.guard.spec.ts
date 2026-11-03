import { ForbiddenException, type ExecutionContext } from '@nestjs/common';
import type { Reflector } from '@nestjs/core';
import { Permission } from '../../role/enums/permission.enum';
import type { AuthenticatedUser } from '../dto/authenticated-user.dto';
import { PermissionsGuard } from './permissions.guard';

function createContext(user?: Partial<AuthenticatedUser>): ExecutionContext {
  return {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
  } as unknown as ExecutionContext;
}

function createGuard(required: Permission[] | undefined): PermissionsGuard {
  return new PermissionsGuard({
    getAllAndOverride: jest.fn().mockReturnValue(required),
  } as unknown as Reflector);
}

describe('PermissionsGuard', () => {
  it('allows a route that requires no permission', () => {
    expect(createGuard(undefined).canActivate(createContext({ permissions: [] }))).toBe(true);
  });

  it('allows a user that has every required permission', () => {
    const guard = createGuard([Permission.PHOTO_UPLOAD, Permission.PHOTO_DELETE]);
    const context = createContext({
      permissions: [Permission.PHOTO_DELETE, Permission.PHOTO_UPLOAD, Permission.TEAM_MANAGE],
    });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('forbids a user that lacks one of the required permissions', () => {
    const guard = createGuard([Permission.PHOTO_UPLOAD, Permission.PHOTO_DELETE]);
    const context = createContext({ permissions: [Permission.PHOTO_UPLOAD] });

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('forbids a request without an authenticated user when a permission is required', () => {
    const guard = createGuard([Permission.PHOTO_UPLOAD]);

    expect(() => guard.canActivate(createContext())).toThrow(ForbiddenException);
  });
});
