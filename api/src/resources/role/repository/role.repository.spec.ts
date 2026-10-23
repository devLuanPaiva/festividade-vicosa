import type { Repository } from 'typeorm';
import type { Role } from '../entities/role.entity';
import { RoleCode } from '../enums/role-code.enum';
import { RoleRepository } from './role.repository';

describe('RoleRepository', () => {
  it('finds a role by its code', async () => {
    const role = { id: 3, code: RoleCode.MANAGER, name: 'Manager' };
    const findOneByOrFail = jest.fn().mockResolvedValue(role);
    const repository = new RoleRepository({ findOneByOrFail } as unknown as Repository<Role>);

    await expect(repository.findByCodeOrFail(RoleCode.MANAGER)).resolves.toBe(role);
    expect(findOneByOrFail).toHaveBeenCalledWith({ code: RoleCode.MANAGER });
  });

  it('propagates the failure when the role does not exist', async () => {
    const findOneByOrFail = jest.fn().mockRejectedValue(new Error('not found'));
    const repository = new RoleRepository({ findOneByOrFail } as unknown as Repository<Role>);

    await expect(repository.findByCodeOrFail(RoleCode.ADMIN)).rejects.toThrow('not found');
  });
});
