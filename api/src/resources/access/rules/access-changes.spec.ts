import { PermissionEffect } from '../../role/enums/permission-effect.enum';
import { Permission } from '../../role/enums/permission.enum';
import {
  assignUserRoles,
  deactivateUser,
  removeOverride,
  removeUser,
  replaceRolePermissions,
  setOverride,
} from './access-changes';
import type { AccessSnapshot } from './access-snapshot';

const FIRST_USER = '00000000-0000-4000-8000-000000000001';
const SECOND_USER = '00000000-0000-4000-8000-000000000002';
const FIRST_ROLE = '00000000-0000-4000-8000-000000000010';
const SECOND_ROLE = '00000000-0000-4000-8000-000000000020';

const snapshot: AccessSnapshot = {
  users: [
    { id: FIRST_USER, active: true, roleIds: [FIRST_ROLE] },
    { id: SECOND_USER, active: true, roleIds: [SECOND_ROLE] },
  ],
  rolePermissions: [
    { roleId: FIRST_ROLE, permission: Permission.PHOTO_UPLOAD },
    { roleId: SECOND_ROLE, permission: Permission.TEAM_MANAGE },
  ],
  overrides: [
    { userId: FIRST_USER, permission: Permission.PHOTO_UPLOAD, effect: PermissionEffect.GRANTED },
  ],
};

describe('access changes', () => {
  it('deactivates only the given user', () => {
    expect(deactivateUser(FIRST_USER)(snapshot).users).toEqual([
      { id: FIRST_USER, active: false, roleIds: [FIRST_ROLE] },
      { id: SECOND_USER, active: true, roleIds: [SECOND_ROLE] },
    ]);
  });

  it('replaces all the roles of only the given user', () => {
    expect(assignUserRoles(SECOND_USER, [FIRST_ROLE, SECOND_ROLE])(snapshot).users).toEqual([
      { id: FIRST_USER, active: true, roleIds: [FIRST_ROLE] },
      { id: SECOND_USER, active: true, roleIds: [FIRST_ROLE, SECOND_ROLE] },
    ]);
  });

  it('removes only the given user', () => {
    expect(removeUser(FIRST_USER)(snapshot).users.map(({ id }) => id)).toEqual([SECOND_USER]);
  });

  it('replaces the permissions of only the given role', () => {
    expect(
      replaceRolePermissions(FIRST_ROLE, [Permission.USER_MANAGE])(snapshot).rolePermissions,
    ).toEqual([
      { roleId: SECOND_ROLE, permission: Permission.TEAM_MANAGE },
      { roleId: FIRST_ROLE, permission: Permission.USER_MANAGE },
    ]);
  });

  it('replaces an existing override of the same user and permission', () => {
    const revoked = {
      userId: FIRST_USER,
      permission: Permission.PHOTO_UPLOAD,
      effect: PermissionEffect.REVOKED,
    };

    expect(setOverride(revoked)(snapshot).overrides).toEqual([revoked]);
  });

  it('adds an override for a permission that had none', () => {
    const granted = {
      userId: SECOND_USER,
      permission: Permission.TEAM_MANAGE,
      effect: PermissionEffect.GRANTED,
    };

    expect(setOverride(granted)(snapshot).overrides).toHaveLength(2);
  });

  it('removes only the override of the given user and permission', () => {
    expect(removeOverride(FIRST_USER, Permission.PHOTO_UPLOAD)(snapshot).overrides).toEqual([]);
    expect(removeOverride(SECOND_USER, Permission.PHOTO_UPLOAD)(snapshot).overrides).toHaveLength(
      1,
    );
  });
});
