import { PermissionEffect } from '../enums/permission-effect.enum';
import { Permission } from '../enums/permission.enum';
import type { RolePermissionRepository } from '../repository/role-permission.repository';
import type { UserPermissionOverrideRepository } from '../repository/user-permission-override.repository';
import type { PermissionOverride } from '../rules/resolve-effective-permissions';
import { AccessControlService } from './access-control.service';

function createFixture(
  rolePermissions: Permission[],
  overrides: PermissionOverride[],
): { service: AccessControlService; findForRole: jest.Mock; findForUser: jest.Mock } {
  const findForRole = jest.fn().mockResolvedValue(rolePermissions);
  const findForUser = jest.fn().mockResolvedValue(overrides);
  const service = new AccessControlService(
    { findPermissionsByRoleId: findForRole } as unknown as RolePermissionRepository,
    { findByUserId: findForUser } as unknown as UserPermissionOverrideRepository,
  );
  return { service, findForRole, findForUser };
}

describe('AccessControlService', () => {
  it('combines the role permissions with the user overrides', async () => {
    const { service } = createFixture(
      [Permission.MATCH_RECORD_SCORE, Permission.PHOTO_UPLOAD],
      [
        { permission: Permission.PHOTO_UPLOAD, effect: PermissionEffect.REVOKED },
        { permission: Permission.PHOTO_DELETE, effect: PermissionEffect.GRANTED },
      ],
    );

    await expect(service.getEffectivePermissions({ id: 7, roleId: 3 })).resolves.toEqual([
      Permission.MATCH_RECORD_SCORE,
      Permission.PHOTO_DELETE,
    ]);
  });

  it('loads permissions by the role and the user of the subject', async () => {
    const { service, findForRole, findForUser } = createFixture([], []);

    await service.getEffectivePermissions({ id: 7, roleId: 3 });

    expect(findForRole).toHaveBeenCalledWith(3);
    expect(findForUser).toHaveBeenCalledWith(7);
  });
});
