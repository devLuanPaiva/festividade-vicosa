import type { Repository } from 'typeorm';
import type { UserPermissionOverride } from '../entities/user-permission-override.entity';
import { PermissionEffect } from '../enums/permission-effect.enum';
import { Permission } from '../enums/permission.enum';
import { UserPermissionOverrideRepository } from './user-permission-override.repository';

describe('UserPermissionOverrideRepository', () => {
  it('returns the overrides of a user as permission and effect pairs', async () => {
    const findBy = jest.fn().mockResolvedValue([
      { userId: 7, permissionCode: Permission.PHOTO_DELETE, effect: PermissionEffect.GRANTED },
      { userId: 7, permissionCode: Permission.PHOTO_UPLOAD, effect: PermissionEffect.REVOKED },
    ]);
    const repository = new UserPermissionOverrideRepository({
      findBy,
    } as unknown as Repository<UserPermissionOverride>);

    await expect(repository.findByUserId(7)).resolves.toEqual([
      { permission: Permission.PHOTO_DELETE, effect: PermissionEffect.GRANTED },
      { permission: Permission.PHOTO_UPLOAD, effect: PermissionEffect.REVOKED },
    ]);
    expect(findBy).toHaveBeenCalledWith({ userId: 7 });
  });
});
