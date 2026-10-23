import { ConflictException, ForbiddenException } from '@nestjs/common';
import { PermissionEffect } from '../../role/enums/permission-effect.enum';
import { Permission } from '../../role/enums/permission.enum';
import type { UserPermissionOverrideRepository } from '../../role/repository/user-permission-override.repository';
import type { AccessPolicyService } from './access-policy.service';
import { UserPermissionService } from './user-permission.service';
import type { UserService } from './user.service';

function createFixture(): {
  service: UserPermissionService;
  overrideRepository: Record<'save' | 'remove', jest.Mock>;
  accessPolicy: Record<'assertNotSelf' | 'assertPermissionsManagerRemains', jest.Mock>;
} {
  const overrideRepository = { save: jest.fn(), remove: jest.fn() };
  const accessPolicy = {
    assertNotSelf: jest.fn(),
    assertPermissionsManagerRemains: jest.fn().mockResolvedValue(undefined),
  };
  const service = new UserPermissionService(
    { findByIdOrFail: jest.fn().mockResolvedValue({ id: 7 }) } as unknown as UserService,
    overrideRepository as unknown as UserPermissionOverrideRepository,
    accessPolicy as unknown as AccessPolicyService,
  );
  return { service, overrideRepository, accessPolicy };
}

const override = {
  userId: 7,
  permission: Permission.PHOTO_DELETE,
  effect: PermissionEffect.GRANTED,
};

describe('UserPermissionService.setOverride', () => {
  it('saves the override of another user', async () => {
    const { service, overrideRepository } = createFixture();

    await service.setOverride(1, override);

    expect(overrideRepository.save).toHaveBeenCalledWith(
      7,
      Permission.PHOTO_DELETE,
      PermissionEffect.GRANTED,
    );
  });

  it('forbids changing the own permissions', async () => {
    const { service, overrideRepository, accessPolicy } = createFixture();
    accessPolicy.assertNotSelf.mockImplementation(() => {
      throw new ForbiddenException();
    });

    await expect(service.setOverride(7, override)).rejects.toBeInstanceOf(ForbiddenException);
    expect(overrideRepository.save).not.toHaveBeenCalled();
  });

  it('does not save when it would leave no permissions manager', async () => {
    const { service, overrideRepository, accessPolicy } = createFixture();
    accessPolicy.assertPermissionsManagerRemains.mockRejectedValue(new ConflictException());

    await expect(service.setOverride(1, override)).rejects.toBeInstanceOf(ConflictException);
    expect(overrideRepository.save).not.toHaveBeenCalled();
  });
});

describe('UserPermissionService.removeOverride', () => {
  it('removes the override of another user', async () => {
    const { service, overrideRepository } = createFixture();

    await service.removeOverride(1, 7, Permission.PHOTO_DELETE);

    expect(overrideRepository.remove).toHaveBeenCalledWith(7, Permission.PHOTO_DELETE);
  });

  it('forbids removing an override of the own permissions', async () => {
    const { service, overrideRepository, accessPolicy } = createFixture();
    accessPolicy.assertNotSelf.mockImplementation(() => {
      throw new ForbiddenException();
    });

    await expect(service.removeOverride(7, 7, Permission.PHOTO_DELETE)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    expect(overrideRepository.remove).not.toHaveBeenCalled();
  });

  it('does not remove when it would leave no permissions manager', async () => {
    const { service, overrideRepository, accessPolicy } = createFixture();
    accessPolicy.assertPermissionsManagerRemains.mockRejectedValue(new ConflictException());

    await expect(
      service.removeOverride(1, 7, Permission.USER_MANAGE_PERMISSIONS),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(overrideRepository.remove).not.toHaveBeenCalled();
  });
});
