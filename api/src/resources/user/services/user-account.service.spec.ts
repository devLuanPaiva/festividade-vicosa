import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { RoleCode } from '../../role/enums/role-code.enum';
import type { RoleRepository } from '../../role/repository/role.repository';
import type { AccessPolicyService } from './access-policy.service';
import { UserAccountService } from './user-account.service';
import type { UserService } from './user.service';

function createFixture(): {
  service: UserAccountService;
  userService: Record<'findByIdOrFail' | 'setActive' | 'setRole', jest.Mock>;
  accessPolicy: Record<'assertNotSelf' | 'assertPermissionsManagerRemains', jest.Mock>;
} {
  const userService = {
    findByIdOrFail: jest.fn().mockResolvedValue({ id: 5 }),
    setActive: jest.fn().mockResolvedValue({ id: 5 }),
    setRole: jest.fn().mockResolvedValue({ id: 5 }),
  };
  const accessPolicy = {
    assertNotSelf: jest.fn(),
    assertPermissionsManagerRemains: jest.fn().mockResolvedValue(undefined),
  };
  const roleRepository = {
    findByCodeOrFail: jest.fn().mockResolvedValue({ id: 2, code: RoleCode.MANAGER }),
  };
  const service = new UserAccountService(
    userService as unknown as UserService,
    roleRepository as unknown as RoleRepository,
    accessPolicy as unknown as AccessPolicyService,
  );
  return { service, userService, accessPolicy };
}

describe('UserAccountService', () => {
  it('activates a user without any restriction', async () => {
    const { service, userService } = createFixture();

    await service.activate(5);

    expect(userService.setActive).toHaveBeenCalledWith(5, true);
  });

  it('deactivates a user after checking that a permissions manager remains', async () => {
    const { service, userService, accessPolicy } = createFixture();

    await service.deactivate(5);

    expect(accessPolicy.assertPermissionsManagerRemains).toHaveBeenCalledTimes(1);
    expect(userService.setActive).toHaveBeenCalledWith(5, false);
  });

  it('does not deactivate the last permissions manager', async () => {
    const { service, userService, accessPolicy } = createFixture();
    accessPolicy.assertPermissionsManagerRemains.mockRejectedValue(new ConflictException());

    await expect(service.deactivate(5)).rejects.toBeInstanceOf(ConflictException);
    expect(userService.setActive).not.toHaveBeenCalled();
  });

  it('does not deactivate a user that does not exist', async () => {
    const { service, userService } = createFixture();
    userService.findByIdOrFail.mockRejectedValue(new NotFoundException());

    await expect(service.deactivate(99)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('changes the role of another user to the id of the requested role', async () => {
    const { service, userService } = createFixture();

    await service.changeRole(1, 5, RoleCode.MANAGER);

    expect(userService.setRole).toHaveBeenCalledWith(5, 2);
  });

  it('forbids changing the own role', async () => {
    const { service, userService, accessPolicy } = createFixture();
    accessPolicy.assertNotSelf.mockImplementation(() => {
      throw new ForbiddenException();
    });

    await expect(service.changeRole(5, 5, RoleCode.MANAGER)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    expect(userService.setRole).not.toHaveBeenCalled();
  });

  it('does not change the role of the last permissions manager', async () => {
    const { service, userService, accessPolicy } = createFixture();
    accessPolicy.assertPermissionsManagerRemains.mockRejectedValue(new ConflictException());

    await expect(service.changeRole(1, 5, RoleCode.ASSISTANT)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(userService.setRole).not.toHaveBeenCalled();
  });
});
