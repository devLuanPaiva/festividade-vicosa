import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import type { AccessPolicyService } from '../../access/services/access-policy.service';
import type { RoleService } from '../../role/services/role.service';
import { UserRoleService } from './user-role.service';
import type { UserService } from './user.service';

const ACTOR_ID = '00000000-0000-4000-8000-000000000001';
const TARGET_ID = '00000000-0000-4000-8000-000000000005';
const MANAGER_ROLE = '00000000-0000-4000-8000-000000000010';
const ASSISTANT_ROLE = '00000000-0000-4000-8000-000000000020';

function createFixture(): {
  service: UserRoleService;
  roleService: Record<'findManyOrFail', jest.Mock>;
  userService: Record<'replaceRoles', jest.Mock>;
  accessPolicy: Record<'assertNotSelf' | 'assertPermissionsManagerRemains', jest.Mock>;
} {
  const roleService = { findManyOrFail: jest.fn().mockResolvedValue([]) };
  const userService = {
    findByIdOrFail: jest.fn().mockResolvedValue({ id: TARGET_ID }),
    getDetails: jest.fn().mockResolvedValue({ user: { id: TARGET_ID }, userRoles: [] }),
    replaceRoles: jest.fn().mockResolvedValue(undefined),
  };
  const accessPolicy = {
    assertNotSelf: jest.fn(),
    assertPermissionsManagerRemains: jest.fn().mockResolvedValue(undefined),
  };
  const service = new UserRoleService(
    userService as unknown as UserService,
    roleService as unknown as RoleService,
    accessPolicy as unknown as AccessPolicyService,
  );
  return { service, roleService, userService, accessPolicy };
}

const bothRoles = { roleIds: [MANAGER_ROLE, ASSISTANT_ROLE], primaryRoleId: ASSISTANT_ROLE };

describe('UserRoleService.assign', () => {
  it('replaces the groups of the user and marks only the chosen one as primary', async () => {
    const { service, userService } = createFixture();

    await service.assign(ACTOR_ID, TARGET_ID, bothRoles);

    expect(userService.replaceRoles).toHaveBeenCalledWith(TARGET_ID, [
      { roleId: MANAGER_ROLE, isPrimary: false },
      { roleId: ASSISTANT_ROLE, isPrimary: true },
    ]);
  });

  it('refuses a primary group that is not among the groups of the user', async () => {
    const { service, userService } = createFixture();

    await expect(
      service.assign(ACTOR_ID, TARGET_ID, {
        roleIds: [MANAGER_ROLE],
        primaryRoleId: ASSISTANT_ROLE,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(userService.replaceRoles).not.toHaveBeenCalled();
  });

  it('refuses a group that does not exist', async () => {
    const { service, roleService, userService } = createFixture();
    roleService.findManyOrFail.mockRejectedValue(new NotFoundException());

    await expect(service.assign(ACTOR_ID, TARGET_ID, bothRoles)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(userService.replaceRoles).not.toHaveBeenCalled();
  });

  it('forbids changing the own groups', async () => {
    const { service, accessPolicy, userService } = createFixture();
    accessPolicy.assertNotSelf.mockImplementation(() => {
      throw new ForbiddenException();
    });

    await expect(service.assign(TARGET_ID, TARGET_ID, bothRoles)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    expect(userService.replaceRoles).not.toHaveBeenCalled();
  });

  it('does not take the permissions manager role from the last manager', async () => {
    const { service, accessPolicy, userService } = createFixture();
    accessPolicy.assertPermissionsManagerRemains.mockRejectedValue(new ConflictException());

    await expect(service.assign(ACTOR_ID, TARGET_ID, bothRoles)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(userService.replaceRoles).not.toHaveBeenCalled();
  });
});
