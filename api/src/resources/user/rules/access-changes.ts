import type { Permission } from '../../role/enums/permission.enum';
import type { AccessOverride, AccessSnapshot } from './access-snapshot';

export type AccessChange = (snapshot: AccessSnapshot) => AccessSnapshot;

export function deactivateUser(userId: string): AccessChange {
  return (snapshot) => ({
    ...snapshot,
    users: snapshot.users.map((user) => (user.id === userId ? { ...user, active: false } : user)),
  });
}

export function changeUserRole(userId: string, roleId: string): AccessChange {
  return (snapshot) => ({
    ...snapshot,
    users: snapshot.users.map((user) => (user.id === userId ? { ...user, roleId } : user)),
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
