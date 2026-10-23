import type { Repository } from 'typeorm';
import type { RolePermission } from '../entities/role-permission.entity';
import { Permission } from '../enums/permission.enum';
import { RolePermissionRepository } from './role-permission.repository';

function createRepository(typeorm: object): RolePermissionRepository {
  return new RolePermissionRepository(typeorm as unknown as Repository<RolePermission>);
}

describe('RolePermissionRepository', () => {
  it('lists every role permission', async () => {
    const rows = [{ roleId: 3, permissionCode: Permission.PHOTO_UPLOAD }];

    await expect(
      createRepository({ find: jest.fn().mockResolvedValue(rows) }).findAll(),
    ).resolves.toBe(rows);
  });

  it('returns the permission codes granted to a role', async () => {
    const findBy = jest.fn().mockResolvedValue([
      { roleId: 3, permissionCode: Permission.PHOTO_UPLOAD },
      { roleId: 3, permissionCode: Permission.MATCH_RECORD_SCORE },
    ]);

    await expect(createRepository({ findBy }).findPermissionsByRoleId(3)).resolves.toEqual([
      Permission.PHOTO_UPLOAD,
      Permission.MATCH_RECORD_SCORE,
    ]);
    expect(findBy).toHaveBeenCalledWith({ roleId: 3 });
  });
});
