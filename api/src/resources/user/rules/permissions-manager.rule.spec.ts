import { PermissionEffect } from '../../role/enums/permission-effect.enum';
import { Permission } from '../../role/enums/permission.enum';
import type { AccessSnapshot } from './access-snapshot';
import { countPermissionsManagers } from './permissions-manager.rule';

const MANAGER_ROLE = '00000000-0000-4000-8000-000000000001';
const ASSISTANT_ROLE = '00000000-0000-4000-8000-000000000002';

const baseSnapshot: AccessSnapshot = {
  users: [
    { id: '00000000-0000-4000-8000-000000000001', active: true, roleId: MANAGER_ROLE },
    { id: '00000000-0000-4000-8000-000000000002', active: true, roleId: ASSISTANT_ROLE },
  ],
  rolePermissions: [
    { roleId: MANAGER_ROLE, permission: Permission.USER_MANAGE_PERMISSIONS },
    { roleId: ASSISTANT_ROLE, permission: Permission.PHOTO_UPLOAD },
  ],
  overrides: [],
};

describe('countPermissionsManagers', () => {
  it.each([
    {
      scenario: 'counts the active users whose role manages permissions',
      snapshot: baseSnapshot,
      expected: 1,
    },
    {
      scenario: 'ignores inactive users',
      snapshot: {
        ...baseSnapshot,
        users: [
          { id: '00000000-0000-4000-8000-000000000001', active: false, roleId: MANAGER_ROLE },
        ],
      },
      expected: 0,
    },
    {
      scenario: 'counts a user that was granted the permission individually',
      snapshot: {
        ...baseSnapshot,
        overrides: [
          {
            userId: '00000000-0000-4000-8000-000000000002',
            permission: Permission.USER_MANAGE_PERMISSIONS,
            effect: PermissionEffect.GRANTED,
          },
        ],
      },
      expected: 2,
    },
    {
      scenario: 'does not count a user whose permission was revoked individually',
      snapshot: {
        ...baseSnapshot,
        overrides: [
          {
            userId: '00000000-0000-4000-8000-000000000001',
            permission: Permission.USER_MANAGE_PERMISSIONS,
            effect: PermissionEffect.REVOKED,
          },
        ],
      },
      expected: 0,
    },
    {
      scenario: 'returns zero when no role manages permissions',
      snapshot: { ...baseSnapshot, rolePermissions: [] },
      expected: 0,
    },
  ])('$scenario', ({ snapshot, expected }) => {
    expect(countPermissionsManagers(snapshot)).toBe(expected);
  });
});
