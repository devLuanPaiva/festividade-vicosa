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
    findByIdOrFail: jest.fn().mockResolvedValue({ id: '00000000-0000-4000-8000-000000000005' }),
    setActive: jest.fn().mockResolvedValue({ id: '00000000-0000-4000-8000-000000000005' }),
    setRole: jest.fn().mockResolvedValue({ id: '00000000-0000-4000-8000-000000000005' }),
  };
  const accessPolicy = {
    assertNotSelf: jest.fn(),
    assertPermissionsManagerRemains: jest.fn().mockResolvedValue(undefined),
  };
  const roleRepository = {
    findByCodeOrFail: jest
      .fn()
      .mockResolvedValue({ id: '00000000-0000-4000-8000-000000000002', code: RoleCode.MANAGER }),
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

    await service.activate('00000000-0000-4000-8000-000000000005');

    expect(userService.setActive).toHaveBeenCalledWith(
      '00000000-0000-4000-8000-000000000005',
      true,
    );
  });

  it('deactivates a user after checking that a permissions manager remains', async () => {
    const { service, userService, accessPolicy } = createFixture();

    await service.deactivate('00000000-0000-4000-8000-000000000005');

    expect(accessPolicy.assertPermissionsManagerRemains).toHaveBeenCalledTimes(1);
    expect(userService.setActive).toHaveBeenCalledWith(
      '00000000-0000-4000-8000-000000000005',
      false,
    );
  });

  it('does not deactivate the last permissions manager', async () => {
    const { service, userService, accessPolicy } = createFixture();
    accessPolicy.assertPermissionsManagerRemains.mockRejectedValue(new ConflictException());

    await expect(service.deactivate('00000000-0000-4000-8000-000000000005')).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(userService.setActive).not.toHaveBeenCalled();
  });

  it('does not deactivate a user that does not exist', async () => {
    const { service, userService } = createFixture();
    userService.findByIdOrFail.mockRejectedValue(new NotFoundException());

    await expect(service.deactivate('00000000-0000-4000-8000-000000000099')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('changes the role of another user to the id of the requested role', async () => {
    const { service, userService } = createFixture();

    await service.changeRole(
      '00000000-0000-4000-8000-000000000001',
      '00000000-0000-4000-8000-000000000005',
      RoleCode.MANAGER,
    );

    expect(userService.setRole).toHaveBeenCalledWith(
      '00000000-0000-4000-8000-000000000005',
      '00000000-0000-4000-8000-000000000002',
    );
  });

  it('forbids changing the own role', async () => {
    const { service, userService, accessPolicy } = createFixture();
    accessPolicy.assertNotSelf.mockImplementation(() => {
      throw new ForbiddenException();
    });

    await expect(
      service.changeRole(
        '00000000-0000-4000-8000-000000000005',
        '00000000-0000-4000-8000-000000000005',
        RoleCode.MANAGER,
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(userService.setRole).not.toHaveBeenCalled();
  });

  it('does not change the role of the last permissions manager', async () => {
    const { service, userService, accessPolicy } = createFixture();
    accessPolicy.assertPermissionsManagerRemains.mockRejectedValue(new ConflictException());

    await expect(
      service.changeRole(
        '00000000-0000-4000-8000-000000000001',
        '00000000-0000-4000-8000-000000000005',
        RoleCode.ASSISTANT,
      ),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(userService.setRole).not.toHaveBeenCalled();
  });
});
