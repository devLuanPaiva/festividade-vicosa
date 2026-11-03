import { PermissionEffect } from '../enums/permission-effect.enum';
import { Permission } from '../enums/permission.enum';
import type { RolePermissionRepository } from '../repository/role-permission.repository';
import type { UserPermissionOverrideRepository } from '../repository/user-permission-override.repository';
import type { UserRoleRepository } from '../repository/user-role.repository';
import type { PermissionOverride } from '../rules/resolve-effective-permissions';
import { AccessControlService } from './access-control.service';

const USER_ID = '00000000-0000-4000-8000-000000000007';
const ROLE_IDS = ['00000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000004'];

function createFixture(
  rolePermissions: Permission[],
  overrides: PermissionOverride[],
): { service: AccessControlService; findForRoles: jest.Mock } {
  const findForRoles = jest.fn().mockResolvedValue(rolePermissions);
  const service = new AccessControlService(
    { findPermissionsByRoleIds: findForRoles } as unknown as RolePermissionRepository,
    {
      findByUserId: jest.fn().mockResolvedValue(overrides),
    } as unknown as UserPermissionOverrideRepository,
    { findRoleIdsByUserId: jest.fn().mockResolvedValue(ROLE_IDS) } as unknown as UserRoleRepository,
  );
  return { service, findForRoles };
}

const overrides: PermissionOverride[] = [
  { permission: Permission.PHOTO_UPLOAD, effect: PermissionEffect.REVOKED },
  { permission: Permission.PHOTO_DELETE, effect: PermissionEffect.GRANTED },
];

describe('AccessControlService', () => {
  it('combines the permissions of every group of the user with the user overrides', async () => {
    const { service, findForRoles } = createFixture(
      [Permission.MATCH_RECORD_SCORE, Permission.PHOTO_UPLOAD],
      overrides,
    );

    await expect(service.getEffectivePermissions({ id: USER_ID })).resolves.toEqual([
      Permission.MATCH_RECORD_SCORE,
      Permission.PHOTO_DELETE,
    ]);
    expect(findForRoles).toHaveBeenCalledWith(ROLE_IDS);
  });
});
