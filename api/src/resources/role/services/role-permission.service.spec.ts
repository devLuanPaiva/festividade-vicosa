import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import type { AccessPolicyService } from '../../access/services/access-policy.service';
import { Permission } from '../enums/permission.enum';
import type { RolePermissionRepository } from '../repository/role-permission.repository';
import { RolePermissionService } from './role-permission.service';
import type { RoleService } from './role.service';

const ACTOR_ID = '00000000-0000-4000-8000-000000000001';
const ROLE_ID = '00000000-0000-4000-8000-000000000002';

function createFixture(): {
  service: RolePermissionService;
  roleService: Record<'findByIdOrFail' | 'get', jest.Mock>;
  rolePermissionRepository: Record<'replace', jest.Mock>;
  accessPolicy: Record<'assertNotMemberOfRole' | 'assertPermissionsManagerRemains', jest.Mock>;
} {
  const roleService = {
    findByIdOrFail: jest.fn().mockResolvedValue({ id: ROLE_ID }),
    get: jest.fn().mockResolvedValue({ id: ROLE_ID }),
  };
  const rolePermissionRepository = { replace: jest.fn().mockResolvedValue(undefined) };
  const accessPolicy = {
    assertNotMemberOfRole: jest.fn().mockResolvedValue(undefined),
    assertPermissionsManagerRemains: jest.fn().mockResolvedValue(undefined),
  };
  const service = new RolePermissionService(
    roleService as unknown as RoleService,
    rolePermissionRepository as unknown as RolePermissionRepository,
    accessPolicy as unknown as AccessPolicyService,
  );
  return { service, roleService, rolePermissionRepository, accessPolicy };
}

describe('RolePermissionService.replace', () => {
  it('replaces the permissions of the group', async () => {
    const { service, rolePermissionRepository } = createFixture();

    await service.replace(ACTOR_ID, ROLE_ID, [Permission.PHOTO_UPLOAD]);

    expect(rolePermissionRepository.replace).toHaveBeenCalledWith(ROLE_ID, [
      Permission.PHOTO_UPLOAD,
    ]);
  });

  it('does not change a group that does not exist', async () => {
    const { service, roleService, rolePermissionRepository } = createFixture();
    roleService.findByIdOrFail.mockRejectedValue(new NotFoundException());

    await expect(service.replace(ACTOR_ID, ROLE_ID, [])).rejects.toBeInstanceOf(NotFoundException);
    expect(rolePermissionRepository.replace).not.toHaveBeenCalled();
  });

  it('does not let the actor change the permissions of their own group', async () => {
    const { service, accessPolicy, rolePermissionRepository } = createFixture();
    accessPolicy.assertNotMemberOfRole.mockRejectedValue(new ForbiddenException());

    await expect(service.replace(ACTOR_ID, ROLE_ID, [])).rejects.toBeInstanceOf(ForbiddenException);
    expect(rolePermissionRepository.replace).not.toHaveBeenCalled();
  });

  it('does not leave the system without a permissions manager', async () => {
    const { service, accessPolicy, rolePermissionRepository } = createFixture();
    accessPolicy.assertPermissionsManagerRemains.mockRejectedValue(new ConflictException());

    await expect(service.replace(ACTOR_ID, ROLE_ID, [])).rejects.toBeInstanceOf(ConflictException);
    expect(rolePermissionRepository.replace).not.toHaveBeenCalled();
  });
});
