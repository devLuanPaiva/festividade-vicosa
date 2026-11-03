import type { Permission } from '../../role/enums/permission.enum';
import type { AccessOverride, AccessSnapshot, AccessUser } from './access-snapshot';

export type AccessChange = (snapshot: AccessSnapshot) => AccessSnapshot;

function updateUser(
  snapshot: AccessSnapshot,
  userId: string,
  changes: Partial<AccessUser>,
): AccessSnapshot {
  return {
    ...snapshot,
    users: snapshot.users.map((user) => (user.id === userId ? { ...user, ...changes } : user)),
  };
}

export function deactivateUser(userId: string): AccessChange {
  return (snapshot) => updateUser(snapshot, userId, { active: false });
}

export function assignUserRoles(userId: string, roleIds: string[]): AccessChange {
  return (snapshot) => updateUser(snapshot, userId, { roleIds });
}

export function removeUser(userId: string): AccessChange {
  return (snapshot) => ({
    ...snapshot,
    users: snapshot.users.filter((user) => user.id !== userId),
  });
}

export function replaceRolePermissions(roleId: string, permissions: Permission[]): AccessChange {
  return (snapshot) => ({
    ...snapshot,
    rolePermissions: [
      ...snapshot.rolePermissions.filter((rolePermission) => rolePermission.roleId !== roleId),
      ...permissions.map((permission) => ({ roleId, permission })),
    ],
  });
}

export function removeOverride(userId: string, permission: Permission): AccessChange {
  return (snapshot) => ({
    ...snapshot,
    overrides: snapshot.overrides.filter(
      (override) => override.userId !== userId || override.permission !== permission,
    ),
  });
}

export function setOverride(override: AccessOverride): AccessChange {
  return (snapshot) => {
    const withoutPrevious = removeOverride(override.userId, override.permission)(snapshot);
    return { ...withoutPrevious, overrides: [...withoutPrevious.overrides, override] };
  };
}
