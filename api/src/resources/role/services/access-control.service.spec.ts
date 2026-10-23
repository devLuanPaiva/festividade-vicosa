import { PermissionEffect } from '../enums/permission-effect.enum';
import { Permission } from '../enums/permission.enum';
import type { RolePermissionRepository } from '../repository/role-permission.repository';
import type { UserPermissionOverrideRepository } from '../repository/user-permission-override.repository';
import type { PermissionOverride } from '../rules/resolve-effective-permissions';
import { AccessControlService } from './access-control.service';

function createFixture(
  rolePermissions: Permission[],
  overrides: PermissionOverride[],
): AccessControlService {
  const findForRole = jest.fn().mockResolvedValue(rolePermissions);
  const findForUser = jest.fn().mockResolvedValue(overrides);
  return new AccessControlService(
    { findPermissionsByRoleId: findForRole } as unknown as RolePermissionRepository,
    { findByUserId: findForUser } as unknown as UserPermissionOverrideRepository,
  );
}

const overrides: PermissionOverride[] = [
  { permission: Permission.PHOTO_UPLOAD, effect: PermissionEffect.REVOKED },
  { permission: Permission.PHOTO_DELETE, effect: PermissionEffect.GRANTED },
];

describe('AccessControlService', () => {
  it('combines the role permissions with the user overrides', async () => {
    const service = createFixture(
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
});
