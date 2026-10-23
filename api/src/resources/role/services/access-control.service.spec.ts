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

const overrides: PermissionOverride[] = [
  { permission: Permission.PHOTO_UPLOAD, effect: PermissionEffect.REVOKED },
  { permission: Permission.PHOTO_DELETE, effect: PermissionEffect.GRANTED },
];

describe('AccessControlService', () => {
  it('combines the role permissions with the user overrides', async () => {
    const { service } = createFixture(
      [Permission.MATCH_RECORD_SCORE, Permission.PHOTO_UPLOAD],
      overrides,
    );

    await expect(
      service.getEffectivePermissions({
        id: '00000000-0000-4000-8000-000000000007',
        roleId: '00000000-0000-4000-8000-000000000003',
      }),
    ).resolves.toEqual([Permission.MATCH_RECORD_SCORE, Permission.PHOTO_DELETE]);
  });

  it('describes the access with the effective permissions and the raw overrides', async () => {
    const { service } = createFixture([Permission.PHOTO_UPLOAD], overrides);

    await expect(
      service.describeAccess({
        id: '00000000-0000-4000-8000-000000000007',
        roleId: '00000000-0000-4000-8000-000000000003',
      }),
    ).resolves.toEqual({
      permissions: [Permission.PHOTO_DELETE],
      overrides,
    });
  });

  it('loads permissions by the role and the user of the subject', async () => {
    const { service, findForRole, findForUser } = createFixture([], []);

    await service.getEffectivePermissions({
      id: '00000000-0000-4000-8000-000000000007',
      roleId: '00000000-0000-4000-8000-000000000003',
    });

    expect(findForRole).toHaveBeenCalledWith('00000000-0000-4000-8000-000000000003');
    expect(findForUser).toHaveBeenCalledWith('00000000-0000-4000-8000-000000000007');
  });
});
