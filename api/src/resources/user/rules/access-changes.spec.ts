import { PermissionEffect } from '../../role/enums/permission-effect.enum';
import { Permission } from '../../role/enums/permission.enum';
import { changeUserRole, deactivateUser, removeOverride, setOverride } from './access-changes';
import type { AccessSnapshot } from './access-snapshot';

const snapshot: AccessSnapshot = {
  users: [
    {
      id: '00000000-0000-4000-8000-000000000001',
      active: true,
      roleId: '00000000-0000-4000-8000-000000000010',
    },
    {
      id: '00000000-0000-4000-8000-000000000002',
      active: true,
      roleId: '00000000-0000-4000-8000-000000000020',
    },
  ],
  rolePermissions: [],
  overrides: [
    {
      userId: '00000000-0000-4000-8000-000000000001',
      permission: Permission.PHOTO_UPLOAD,
      effect: PermissionEffect.GRANTED,
    },
  ],
};

describe('access changes', () => {
  it('deactivates only the given user', () => {
    expect(deactivateUser('00000000-0000-4000-8000-000000000001')(snapshot).users).toEqual([
      {
        id: '00000000-0000-4000-8000-000000000001',
        active: false,
        roleId: '00000000-0000-4000-8000-000000000010',
      },
      {
        id: '00000000-0000-4000-8000-000000000002',
        active: true,
        roleId: '00000000-0000-4000-8000-000000000020',
      },
    ]);
  });

  it('changes the role of only the given user', () => {
    expect(
      changeUserRole(
        '00000000-0000-4000-8000-000000000002',
        '00000000-0000-4000-8000-000000000030',
      )(snapshot).users,
    ).toEqual([
      {
        id: '00000000-0000-4000-8000-000000000001',
        active: true,
        roleId: '00000000-0000-4000-8000-000000000010',
      },
      {
        id: '00000000-0000-4000-8000-000000000002',
        active: true,
        roleId: '00000000-0000-4000-8000-000000000030',
      },
    ]);
  });

  it('replaces an existing override of the same user and permission', () => {
    const revoked = {
      userId: '00000000-0000-4000-8000-000000000001',
      permission: Permission.PHOTO_UPLOAD,
      effect: PermissionEffect.REVOKED,
    };

    expect(setOverride(revoked)(snapshot).overrides).toEqual([revoked]);
  });

  it('adds an override for a permission that had none', () => {
    const granted = {
      userId: '00000000-0000-4000-8000-000000000002',
      permission: Permission.TEAM_MANAGE,
      effect: PermissionEffect.GRANTED,
    };

    expect(setOverride(granted)(snapshot).overrides).toHaveLength(2);
  });

  it('removes only the override of the given user and permission', () => {
    expect(
      removeOverride('00000000-0000-4000-8000-000000000001', Permission.PHOTO_UPLOAD)(snapshot)
        .overrides,
    ).toEqual([]);
    expect(
      removeOverride('00000000-0000-4000-8000-000000000002', Permission.PHOTO_UPLOAD)(snapshot)
        .overrides,
    ).toHaveLength(1);
  });
});
