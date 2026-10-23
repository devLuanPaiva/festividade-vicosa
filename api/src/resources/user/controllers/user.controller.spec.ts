import { REQUIRED_PERMISSIONS_KEY } from '../../auth/decorators/decorators';
import type { AuthenticatedUser } from '../../auth/dto/authenticated-user.dto';
import { Permission } from '../../role/enums/permission.enum';
import { RoleCode } from '../../role/enums/role-code.enum';
import type { User } from '../entities/user.entity';
import type { UserAccountService } from '../services/user-account.service';
import type { UserService } from '../services/user.service';
import { UserController } from './user.controller';

const createdAt = new Date('2026-10-22T12:00:00Z');
const storedUser = {
  id: 4,
  name: 'Ana',
  email: 'ana@example.com',
  passwordHash: 'secret-hash',
  active: true,
  role: { code: RoleCode.MANAGER },
  createdAt,
} as User;
const publicUser = {
  id: 4,
  name: 'Ana',
  email: 'ana@example.com',
  active: true,
  roleCode: RoleCode.MANAGER,
  createdAt,
};
const actor: AuthenticatedUser = {
  id: 1,
  name: 'Admin',
  email: 'admin@example.com',
  permissions: [],
};

function createController(): {
  controller: UserController;
  userService: Record<'list' | 'create', jest.Mock>;
  accountService: Record<'activate' | 'deactivate' | 'changeRole', jest.Mock>;
} {
  const userService = {
    list: jest.fn().mockResolvedValue([storedUser]),
    create: jest.fn().mockResolvedValue(storedUser),
  };
  const accountService = {
    activate: jest.fn().mockResolvedValue(storedUser),
    deactivate: jest.fn().mockResolvedValue(storedUser),
    changeRole: jest.fn().mockResolvedValue(storedUser),
  };
  const controller = new UserController(
    userService as unknown as UserService,
    accountService as unknown as UserAccountService,
  );
  return { controller, userService, accountService };
}

describe('UserController', () => {
  it('lists the users without exposing the password hash', async () => {
    const { controller } = createController();

    await expect(controller.list()).resolves.toEqual([publicUser]);
  });

  it('creates a user with the requested role', async () => {
    const { controller, userService } = createController();
    const input = {
      name: 'Ana',
      email: 'ana@example.com',
      password: 'a-long-password',
      roleCode: RoleCode.MANAGER,
    };

    await expect(controller.create(input)).resolves.toEqual(publicUser);
    expect(userService.create).toHaveBeenCalledWith(RoleCode.MANAGER, input);
  });

  it('activates a user', async () => {
    const { controller, accountService } = createController();

    await expect(controller.activate(4)).resolves.toEqual(publicUser);
    expect(accountService.activate).toHaveBeenCalledWith(4);
  });

  it('deactivates a user', async () => {
    const { controller, accountService } = createController();

    await expect(controller.deactivate(4)).resolves.toEqual(publicUser);
    expect(accountService.deactivate).toHaveBeenCalledWith(4);
  });

  it('changes the role on behalf of the authenticated user', async () => {
    const { controller, accountService } = createController();

    await controller.changeRole(actor, 4, { roleCode: RoleCode.ASSISTANT });

    expect(accountService.changeRole).toHaveBeenCalledWith(1, 4, RoleCode.ASSISTANT);
  });
});

describe('UserController permissions', () => {
  it.each([
    { handler: 'list', permission: Permission.USER_MANAGE },
    { handler: 'create', permission: Permission.USER_MANAGE },
    { handler: 'activate', permission: Permission.USER_MANAGE },
    { handler: 'deactivate', permission: Permission.USER_MANAGE },
    { handler: 'changeRole', permission: Permission.USER_MANAGE_PERMISSIONS },
  ] as const)('requires $permission to call $handler', ({ handler, permission }) => {
    expect(
      Reflect.getMetadata(REQUIRED_PERMISSIONS_KEY, UserController.prototype[handler]),
    ).toEqual([permission]);
  });
});
