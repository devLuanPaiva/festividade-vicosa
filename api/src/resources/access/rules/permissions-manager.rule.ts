import { Permission } from '../../role/enums/permission.enum';
import { resolveEffectivePermissions } from '../../role/rules/resolve-effective-permissions';
import type { AccessSnapshot, AccessUser } from './access-snapshot';

function hasPermissionsManagement(snapshot: AccessSnapshot, user: AccessUser): boolean {
  const rolePermissions = snapshot.rolePermissions
    .filter((rolePermission) => user.roleIds.includes(rolePermission.roleId))
    .map((rolePermission) => rolePermission.permission);
  const overrides = snapshot.overrides.filter((override) => override.userId === user.id);

  return resolveEffectivePermissions(rolePermissions, overrides).includes(
    Permission.USER_MANAGE_PERMISSIONS,
  );
}

export function countPermissionsManagers(snapshot: AccessSnapshot): number {
  return snapshot.users.filter((user) => user.active && hasPermissionsManagement(snapshot, user))
    .length;
}
