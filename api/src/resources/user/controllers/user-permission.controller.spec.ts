import { REQUIRED_PERMISSIONS_KEY } from '../../auth/decorators/decorators';
import type { AuthenticatedUser } from '../../auth/dto/authenticated-user.dto';
import { PermissionEffect } from '../../role/enums/permission-effect.enum';
import { Permission } from '../../role/enums/permission.enum';
import type { UserPermissionQueryService } from '../services/user-permission-query.service';
import type { UserPermissionService } from '../services/user-permission.service';
import { UserPermissionController } from './user-permission.controller';

const actor: AuthenticatedUser = {
  id: '00000000-0000-4000-8000-000000000001',
  name: 'Admin',
  email: 'admin@example.com',
  permissions: [],
};

function createController(): {
  controller: UserPermissionController;
  queryService: Record<'getPermissions', jest.Mock>;
  permissionService: Record<'setOverride' | 'removeOverride', jest.Mock>;
} {
  const queryService = {
    getPermissions: jest.fn().mockResolvedValue({ permissions: [], overrides: [] }),
  };
  const permissionService = {
    setOverride: jest.fn().mockResolvedValue(undefined),
    removeOverride: jest.fn().mockResolvedValue(undefined),
  };
  const controller = new UserPermissionController(
    queryService as unknown as UserPermissionQueryService,
    permissionService as unknown as UserPermissionService,
  );
  return { controller, queryService, permissionService };
}

describe('UserPermissionController', () => {
  it('sets an override on behalf of the authenticated user', async () => {
    const { controller, permissionService } = createController();

    await controller.set(
      actor,
      { id: '00000000-0000-4000-8000-000000000007', permission: Permission.PHOTO_DELETE },
      { effect: PermissionEffect.GRANTED },
    );

    expect(permissionService.setOverride).toHaveBeenCalledWith(
      '00000000-0000-4000-8000-000000000001',
      {
        userId: '00000000-0000-4000-8000-000000000007',
        permission: Permission.PHOTO_DELETE,
        effect: PermissionEffect.GRANTED,
      },
    );
  });

  it('removes an override on behalf of the authenticated user', async () => {
    const { controller, permissionService } = createController();

    await controller.remove(actor, {
      id: '00000000-0000-4000-8000-000000000007',
      permission: Permission.PHOTO_DELETE,
    });

    expect(permissionService.removeOverride).toHaveBeenCalledWith(
      '00000000-0000-4000-8000-000000000001',
      '00000000-0000-4000-8000-000000000007',
      Permission.PHOTO_DELETE,
    );
  });

  it.each([
    { handler: 'get', permission: Permission.USER_MANAGE },
    { handler: 'set', permission: Permission.USER_MANAGE_PERMISSIONS },
    { handler: 'remove', permission: Permission.USER_MANAGE_PERMISSIONS },
  ] as const)('requires $permission to call $handler', ({ handler, permission }) => {
    expect(
      Reflect.getMetadata(REQUIRED_PERMISSIONS_KEY, UserPermissionController.prototype[handler]),
    ).toEqual([permission]);
  });
});
