import { RoleCode } from '../../role/enums/role-code.enum';
import type { RoleRepository } from '../../role/repository/role.repository';
import type { UserRepository } from '../repository/user.repository';
import type { PasswordHasher } from './password-hasher';
import { UserService } from './user.service';

function createFixture(): {
  service: UserService;
  userRepository: Record<'findActiveByEmail' | 'findActiveById' | 'count' | 'create', jest.Mock>;
  roleRepository: Record<'findByCodeOrFail', jest.Mock>;
} {
  const userRepository = {
    findActiveByEmail: jest.fn(),
    findActiveById: jest.fn(),
    count: jest.fn(),
    create: jest.fn((record: object) => Promise.resolve(record)),
  };
  const roleRepository = {
    findByCodeOrFail: jest.fn().mockResolvedValue({ id: 3, code: RoleCode.ADMIN }),
  };
  const passwordHasher = { hash: jest.fn().mockResolvedValue('hashed-password') };
  const service = new UserService(
    userRepository as unknown as UserRepository,
    roleRepository as unknown as RoleRepository,
    passwordHasher as unknown as PasswordHasher,
  );
  return { service, userRepository, roleRepository };
}

describe('UserService', () => {
  it('finds an active user by email', async () => {
    const { service, userRepository } = createFixture();

    await service.findActiveByEmail('ana@example.com');

    expect(userRepository.findActiveByEmail).toHaveBeenCalledWith('ana@example.com');
  });

  it('finds an active user by id', async () => {
    const { service, userRepository } = createFixture();

    await service.findActiveById(5);

    expect(userRepository.findActiveById).toHaveBeenCalledWith(5);
  });

  it('counts the registered users', async () => {
    const { service, userRepository } = createFixture();
    userRepository.count.mockResolvedValue(2);

    await expect(service.count()).resolves.toBe(2);
  });

  it('creates a user with a hashed password and the id of the requested role', async () => {
    const { service, roleRepository } = createFixture();

    const user = await service.createWithRole(RoleCode.ADMIN, {
      name: 'Ana',
      email: 'ana@example.com',
      password: 'a-long-password',
    });

    expect(roleRepository.findByCodeOrFail).toHaveBeenCalledWith(RoleCode.ADMIN);
    expect(user).toEqual({
      name: 'Ana',
      email: 'ana@example.com',
      passwordHash: 'hashed-password',
      roleId: 3,
    });
  });
});
