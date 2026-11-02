import { ConflictException, ForbiddenException } from '@nestjs/common';
import { Permission } from '../../role/enums/permission.enum';
import type { AccessSnapshotRepository } from '../repository/access-snapshot.repository';
import {
  assignUserRoles,
  deactivateUser,
  removeUser,
  replaceRolePermissions,
} from '../rules/access-changes';
import type { AccessUser } from '../rules/access-snapshot';
import { AccessPolicyService } from './access-policy.service';

const MANAGER_ROLE = '00000000-0000-4000-8000-000000000001';
const ASSISTANT_ROLE = '00000000-0000-4000-8000-000000000002';
const FIRST_USER = '00000000-0000-4000-8000-000000000001';
const SECOND_USER = '00000000-0000-4000-8000-000000000002';
const ASSISTANT_USER = '00000000-0000-4000-8000-000000000003';

function createService(users: AccessUser[]): AccessPolicyService {
  const snapshot = {
    users,
    rolePermissions: [
      { roleId: MANAGER_ROLE, permission: Permission.USER_MANAGE_PERMISSIONS },
      { roleId: ASSISTANT_ROLE, permission: Permission.PHOTO_UPLOAD },
    ],
    overrides: [],
  };
  return new AccessPolicyService({
    load: jest.fn().mockResolvedValue(snapshot),
  } as unknown as AccessSnapshotRepository);
}

const twoManagers: AccessUser[] = [
  { id: FIRST_USER, active: true, roleIds: [MANAGER_ROLE] },
  { id: SECOND_USER, active: true, roleIds: [MANAGER_ROLE] },
];
const oneManager: AccessUser[] = [
  { id: FIRST_USER, active: true, roleIds: [MANAGER_ROLE] },
  { id: ASSISTANT_USER, active: true, roleIds: [ASSISTANT_ROLE] },
];

describe('AccessPolicyService.assertNotSelf', () => {
  it('forbids a user from changing their own permissions', () => {
    expect(() => {
      createService([]).assertNotSelf(FIRST_USER, FIRST_USER);
    }).toThrow(ForbiddenException);
  });
});

describe('AccessPolicyService.assertNotMemberOfRole', () => {
  it('forbids changing the permissions of a role the actor belongs to', async () => {
    const service = createService([
      { id: FIRST_USER, active: true, roleIds: [ASSISTANT_ROLE, MANAGER_ROLE] },
    ]);

    await expect(service.assertNotMemberOfRole(FIRST_USER, MANAGER_ROLE)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('allows changing a role the actor does not belong to', async () => {
    await expect(
      createService(oneManager).assertNotMemberOfRole(FIRST_USER, ASSISTANT_ROLE),
    ).resolves.toBeUndefined();
  });
});

describe('AccessPolicyService.assertPermissionsManagerRemains', () => {
  it('allows removing one manager while another remains', async () => {
    await expect(
      createService(twoManagers).assertPermissionsManagerRemains(deactivateUser(FIRST_USER)),
    ).resolves.toBeUndefined();
  });

  it.each([
    { scenario: 'deactivating', change: deactivateUser(FIRST_USER) },
    { scenario: 'deleting', change: removeUser(FIRST_USER) },
    {
      scenario: 'moving to a group without the permission',
      change: assignUserRoles(FIRST_USER, [ASSISTANT_ROLE]),
    },
    {
      scenario: 'taking the permission away from their group',
      change: replaceRolePermissions(MANAGER_ROLE, [Permission.PHOTO_UPLOAD]),
    },
  ])('blocks $scenario the last active manager', async ({ change }) => {
    await expect(
      createService(oneManager).assertPermissionsManagerRemains(change),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('allows keeping the permission through a second group', async () => {
    await expect(
      createService(oneManager).assertPermissionsManagerRemains(
        assignUserRoles(FIRST_USER, [ASSISTANT_ROLE, MANAGER_ROLE]),
      ),
    ).resolves.toBeUndefined();
  });

  it('does not block changes that never touched a manager', async () => {
    await expect(
      createService(oneManager).assertPermissionsManagerRemains(deactivateUser(ASSISTANT_USER)),
    ).resolves.toBeUndefined();
  });
});
