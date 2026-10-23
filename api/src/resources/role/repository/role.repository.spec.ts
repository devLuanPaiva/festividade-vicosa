import type { Repository } from 'typeorm';
import type { Role } from '../entities/role.entity';
import { RoleCode } from '../enums/role-code.enum';
import { RoleRepository } from './role.repository';

function createRepository(typeorm: object): RoleRepository {
  return new RoleRepository(typeorm as unknown as Repository<Role>);
}

describe('RoleRepository', () => {
  it('lists the roles ordered by id', async () => {
    const find = jest.fn().mockResolvedValue([]);

    await createRepository({ find }).findAll();

    expect(find).toHaveBeenCalledWith({ order: { id: 'ASC' } });
  });

  it('finds a role by its code', async () => {
    const role = {
      id: '00000000-0000-4000-8000-000000000003',
      code: RoleCode.MANAGER,
      name: 'Manager',
    };
    const findOneByOrFail = jest.fn().mockResolvedValue(role);

    await expect(
      createRepository({ findOneByOrFail }).findByCodeOrFail(RoleCode.MANAGER),
    ).resolves.toBe(role);
    expect(findOneByOrFail).toHaveBeenCalledWith({ code: RoleCode.MANAGER });
  });

  it('propagates the failure when the role does not exist', async () => {
    const findOneByOrFail = jest.fn().mockRejectedValue(new Error('not found'));

    await expect(
      createRepository({ findOneByOrFail }).findByCodeOrFail(RoleCode.ADMIN),
    ).rejects.toThrow('not found');
  });
});
