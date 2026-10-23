import type { Repository } from 'typeorm';
import type { UserPermissionOverride } from '../entities/user-permission-override.entity';
import { PermissionEffect } from '../enums/permission-effect.enum';
import { Permission } from '../enums/permission.enum';
import { UserPermissionOverrideRepository } from './user-permission-override.repository';

function createRepository(typeorm: object): UserPermissionOverrideRepository {
  return new UserPermissionOverrideRepository(
    typeorm as unknown as Repository<UserPermissionOverride>,
  );
}

describe('UserPermissionOverrideRepository', () => {
  it('lists every override', async () => {
    const rows = [
      { userId: 7, permissionCode: Permission.PHOTO_DELETE, effect: PermissionEffect.GRANTED },
    ];

    await expect(
      createRepository({ find: jest.fn().mockResolvedValue(rows) }).findAll(),
    ).resolves.toBe(rows);
  });

  it('returns the overrides of a user as permission and effect pairs', async () => {
    const findBy = jest.fn().mockResolvedValue([
      { userId: 7, permissionCode: Permission.PHOTO_DELETE, effect: PermissionEffect.GRANTED },
      { userId: 7, permissionCode: Permission.PHOTO_UPLOAD, effect: PermissionEffect.REVOKED },
    ]);

    await expect(createRepository({ findBy }).findByUserId(7)).resolves.toEqual([
      { permission: Permission.PHOTO_DELETE, effect: PermissionEffect.GRANTED },
      { permission: Permission.PHOTO_UPLOAD, effect: PermissionEffect.REVOKED },
    ]);
    expect(findBy).toHaveBeenCalledWith({ userId: 7 });
  });

  it('saves an override for a user and permission', async () => {
    const save = jest.fn().mockResolvedValue({});

    await createRepository({ save }).save(7, Permission.TEAM_MANAGE, PermissionEffect.GRANTED);

    expect(save).toHaveBeenCalledWith({
      userId: 7,
      permissionCode: Permission.TEAM_MANAGE,
      effect: PermissionEffect.GRANTED,
    });
  });

  it('removes the override of a user and permission', async () => {
    const remove = jest.fn().mockResolvedValue({});

    await createRepository({ delete: remove }).remove(7, Permission.TEAM_MANAGE);

    expect(remove).toHaveBeenCalledWith({ userId: 7, permissionCode: Permission.TEAM_MANAGE });
  });
});
