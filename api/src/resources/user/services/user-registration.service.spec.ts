import { NotFoundException } from '@nestjs/common';
import type { RoleService } from '../../role/services/role.service';
import { UserRegistrationService } from './user-registration.service';
import type { UserService } from './user.service';

const ROLE_ID = '00000000-0000-4000-8000-000000000003';
const newUser = { name: 'Ana', email: 'ana@example.com', password: 'a-long-password' };

describe('UserRegistrationService', () => {
  it('creates the user in the chosen group', async () => {
    const create = jest.fn().mockResolvedValue({ user: { id: 'created' }, userRoles: [] });
    const service = new UserRegistrationService(
      { findByIdOrFail: jest.fn().mockResolvedValue({ id: ROLE_ID }) } as unknown as RoleService,
      { create } as unknown as UserService,
    );

    await service.create(ROLE_ID, newUser);

    expect(create).toHaveBeenCalledWith(ROLE_ID, newUser);
  });

  it('does not create a user in a group that does not exist', async () => {
    const create = jest.fn();
    const service = new UserRegistrationService(
      {
        findByIdOrFail: jest.fn().mockRejectedValue(new NotFoundException()),
      } as unknown as RoleService,
      { create } as unknown as UserService,
    );

    await expect(service.create(ROLE_ID, newUser)).rejects.toBeInstanceOf(NotFoundException);
    expect(create).not.toHaveBeenCalled();
  });
});
