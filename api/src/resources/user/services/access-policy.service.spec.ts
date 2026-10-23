import { ConflictException, ForbiddenException } from '@nestjs/common';
import { PermissionEffect } from '../../role/enums/permission-effect.enum';
import { Permission } from '../../role/enums/permission.enum';
import type { RolePermissionRepository } from '../../role/repository/role-permission.repository';
import type { UserPermissionOverrideRepository } from '../../role/repository/user-permission-override.repository';
import type { UserRepository } from '../repository/user.repository';
import { changeUserRole, deactivateUser, removeOverride } from '../rules/access-changes';
import { AccessPolicyService } from './access-policy.service';

const MANAGER_ROLE = '00000000-0000-4000-8000-000000000001';
const ASSISTANT_ROLE = '00000000-0000-4000-8000-000000000002';

interface Fixture {
  users: { id: string; active: boolean; roleId: string }[];
  overrides?: { userId: string; permissionCode: Permission; effect: PermissionEffect }[];
}

function createService({ users, overrides = [] }: Fixture): AccessPolicyService {
  return new AccessPolicyService(
    { findAccessUsers: jest.fn().mockResolvedValue(users) } as unknown as UserRepository,
    {
      findAll: jest.fn().mockResolvedValue([
        { roleId: MANAGER_ROLE, permissionCode: Permission.USER_MANAGE_PERMISSIONS },
        { roleId: ASSISTANT_ROLE, permissionCode: Permission.PHOTO_UPLOAD },
      ]),
    } as unknown as RolePermissionRepository,
    {
      findAll: jest.fn().mockResolvedValue(overrides),
    } as unknown as UserPermissionOverrideRepository,
  );
}

const twoManagers = [
  { id: '00000000-0000-4000-8000-000000000001', active: true, roleId: MANAGER_ROLE },
  { id: '00000000-0000-4000-8000-000000000002', active: true, roleId: MANAGER_ROLE },
];
const oneManager = [
  { id: '00000000-0000-4000-8000-000000000001', active: true, roleId: MANAGER_ROLE },
  { id: '00000000-0000-4000-8000-000000000003', active: true, roleId: ASSISTANT_ROLE },
];

describe('AccessPolicyService.assertNotSelf', () => {
  const service = createService({ users: [] });

  it('forbids a user from changing their own permissions', () => {
    expect(() => {
      service.assertNotSelf(
        '00000000-0000-4000-8000-000000000005',
        '00000000-0000-4000-8000-000000000005',
      );
    }).toThrow(ForbiddenException);
  });
});

describe('AccessPolicyService.assertPermissionsManagerRemains', () => {
  it('allows removing one manager while another remains', async () => {
    const service = createService({ users: twoManagers });

    await expect(
      service.assertPermissionsManagerRemains(
        deactivateUser('00000000-0000-4000-8000-000000000001'),
      ),
    ).resolves.toBeUndefined();
  });

  it('blocks deactivating the last active manager', async () => {
    const service = createService({ users: oneManager });

    await expect(
      service.assertPermissionsManagerRemains(
        deactivateUser('00000000-0000-4000-8000-000000000001'),
      ),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('blocks moving the last manager to a role without the permission', async () => {
    const service = createService({ users: oneManager });

    await expect(
      service.assertPermissionsManagerRemains(
        changeUserRole('00000000-0000-4000-8000-000000000001', ASSISTANT_ROLE),
      ),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('blocks removing the individual grant that makes a user the last manager', async () => {
    const service = createService({
      users: [{ id: '00000000-0000-4000-8000-000000000001', active: true, roleId: ASSISTANT_ROLE }],
      overrides: [
        {
          userId: '00000000-0000-4000-8000-000000000001',
          permissionCode: Permission.USER_MANAGE_PERMISSIONS,
          effect: PermissionEffect.GRANTED,
        },
      ],
    });
    const removeGrant = removeOverride(
      '00000000-0000-4000-8000-000000000001',
      Permission.USER_MANAGE_PERMISSIONS,
    );

    await expect(service.assertPermissionsManagerRemains(removeGrant)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('does not block changes that never touched a manager', async () => {
    const service = createService({ users: oneManager });

    await expect(
      service.assertPermissionsManagerRemains(
        deactivateUser('00000000-0000-4000-8000-000000000003'),
      ),
    ).resolves.toBeUndefined();
  });
});
