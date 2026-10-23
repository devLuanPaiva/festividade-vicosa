import type { Repository } from 'typeorm';
import type { RolePermission } from '../entities/role-permission.entity';
import { Permission } from '../enums/permission.enum';
import { RolePermissionRepository } from './role-permission.repository';

describe('RolePermissionRepository', () => {
  it('returns the permission codes granted to a role', async () => {
    const findBy = jest.fn().mockResolvedValue([
      { roleId: 3, permissionCode: Permission.PHOTO_UPLOAD },
      { roleId: 3, permissionCode: Permission.MATCH_RECORD_SCORE },
    ]);
    const repository = new RolePermissionRepository({
      findBy,
    } as unknown as Repository<RolePermission>);

    await expect(repository.findPermissionsByRoleId(3)).resolves.toEqual([
      Permission.PHOTO_UPLOAD,
      Permission.MATCH_RECORD_SCORE,
    ]);
    expect(findBy).toHaveBeenCalledWith({ roleId: 3 });
  });
});
