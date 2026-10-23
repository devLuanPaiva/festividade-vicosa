import { Permission } from '../enums/permission.enum';
import { RoleCode } from '../enums/role-code.enum';
import type { RolePermissionRepository } from '../repository/role-permission.repository';
import type { RoleRepository } from '../repository/role.repository';
import { RoleService } from './role.service';

describe('RoleService', () => {
  it('lists every role with its own permissions', async () => {
    const service = new RoleService(
      {
        findAll: jest.fn().mockResolvedValue([
          { id: 1, code: RoleCode.ADMIN, name: 'Administrator' },
          { id: 2, code: RoleCode.ASSISTANT, name: 'Assistant' },
        ]),
      } as unknown as RoleRepository,
      {
        findAll: jest.fn().mockResolvedValue([
          { roleId: 1, permissionCode: Permission.USER_MANAGE },
          { roleId: 1, permissionCode: Permission.PHOTO_UPLOAD },
          { roleId: 2, permissionCode: Permission.PHOTO_UPLOAD },
        ]),
      } as unknown as RolePermissionRepository,
    );

    await expect(service.list()).resolves.toEqual([
      {
        code: RoleCode.ADMIN,
        name: 'Administrator',
        permissions: [Permission.USER_MANAGE, Permission.PHOTO_UPLOAD],
      },
      { code: RoleCode.ASSISTANT, name: 'Assistant', permissions: [Permission.PHOTO_UPLOAD] },
    ]);
  });
});
