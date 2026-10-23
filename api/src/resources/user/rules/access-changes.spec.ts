import { PermissionEffect } from '../../role/enums/permission-effect.enum';
import { Permission } from '../../role/enums/permission.enum';
import { changeUserRole, deactivateUser, removeOverride, setOverride } from './access-changes';
import type { AccessSnapshot } from './access-snapshot';

const snapshot: AccessSnapshot = {
  users: [
    { id: 1, active: true, roleId: 10 },
    { id: 2, active: true, roleId: 20 },
  ],
  rolePermissions: [],
  overrides: [{ userId: 1, permission: Permission.PHOTO_UPLOAD, effect: PermissionEffect.GRANTED }],
};

describe('access changes', () => {
  it('deactivates only the given user', () => {
    expect(deactivateUser(1)(snapshot).users).toEqual([
      { id: 1, active: false, roleId: 10 },
      { id: 2, active: true, roleId: 20 },
    ]);
  });

  it('changes the role of only the given user', () => {
    expect(changeUserRole(2, 30)(snapshot).users).toEqual([
      { id: 1, active: true, roleId: 10 },
      { id: 2, active: true, roleId: 30 },
    ]);
  });

  it('replaces an existing override of the same user and permission', () => {
    const revoked = {
      userId: 1,
      permission: Permission.PHOTO_UPLOAD,
      effect: PermissionEffect.REVOKED,
    };

    expect(setOverride(revoked)(snapshot).overrides).toEqual([revoked]);
  });

  it('adds an override for a permission that had none', () => {
    const granted = {
      userId: 2,
      permission: Permission.TEAM_MANAGE,
      effect: PermissionEffect.GRANTED,
    };

    expect(setOverride(granted)(snapshot).overrides).toHaveLength(2);
  });

  it('removes only the override of the given user and permission', () => {
    expect(removeOverride(1, Permission.PHOTO_UPLOAD)(snapshot).overrides).toEqual([]);
    expect(removeOverride(2, Permission.PHOTO_UPLOAD)(snapshot).overrides).toHaveLength(1);
  });

  it('does not mutate the original snapshot', () => {
    deactivateUser(1)(snapshot);

    expect(snapshot.users[0]?.active).toBe(true);
  });
});
