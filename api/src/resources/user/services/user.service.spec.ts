import { ConflictException, NotFoundException } from '@nestjs/common';
import { RoleCode } from '../../role/enums/role-code.enum';
import type { RoleRepository } from '../../role/repository/role.repository';
import type { UserRepository } from '../repository/user.repository';
import type { PasswordHasher } from './password-hasher';
import { UserService } from './user.service';

type UserRepositoryMock = Record<
  | 'findAll'
  | 'findById'
  | 'findByEmail'
  | 'findActiveByEmail'
  | 'findActiveById'
  | 'count'
  | 'create'
  | 'updateAccount',
  jest.Mock
>;

const storedUser = { id: 8, name: 'Ana', roleId: 3 };

function createFixture(): {
  service: UserService;
  userRepository: UserRepositoryMock;
  roleRepository: Record<'findByCodeOrFail', jest.Mock>;
} {
  const userRepository: UserRepositoryMock = {
    findAll: jest.fn(),
    findById: jest.fn().mockResolvedValue(storedUser),
    findByEmail: jest.fn().mockResolvedValue(null),
    findActiveByEmail: jest.fn(),
    findActiveById: jest.fn(),
    count: jest.fn(),
    create: jest.fn((record: object) => Promise.resolve({ id: 8, ...record })),
    updateAccount: jest.fn().mockResolvedValue(undefined),
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

const newUser = { name: 'Ana', email: 'ana@example.com', password: 'a-long-password' };

describe('UserService queries', () => {
  it('lists the users', async () => {
    const { service, userRepository } = createFixture();
    userRepository.findAll.mockResolvedValue([storedUser]);

    await expect(service.list()).resolves.toEqual([storedUser]);
  });

  it('returns the user found by id', async () => {
    const { service } = createFixture();

    await expect(service.findByIdOrFail(8)).resolves.toBe(storedUser);
  });

  it('throws not found when the user does not exist', async () => {
    const { service, userRepository } = createFixture();
    userRepository.findById.mockResolvedValue(null);

    await expect(service.findByIdOrFail(99)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('delegates the active lookups and the count to the repository', async () => {
    const { service, userRepository } = createFixture();
    userRepository.count.mockResolvedValue(2);

    await service.findActiveByEmail('ana@example.com');
    await service.findActiveById(5);

    expect(userRepository.findActiveByEmail).toHaveBeenCalledWith('ana@example.com');
    expect(userRepository.findActiveById).toHaveBeenCalledWith(5);
    await expect(service.count()).resolves.toBe(2);
  });
});

describe('UserService commands', () => {
  it('creates a user with a hashed password and the id of the requested role', async () => {
    const { service, roleRepository, userRepository } = createFixture();

    await service.createWithRole(RoleCode.ADMIN, newUser);

    expect(roleRepository.findByCodeOrFail).toHaveBeenCalledWith(RoleCode.ADMIN);
    expect(userRepository.create).toHaveBeenCalledWith({
      name: 'Ana',
      email: 'ana@example.com',
      passwordHash: 'hashed-password',
      roleId: 3,
    });
  });

  it('creates a user and returns it reloaded with the role', async () => {
    const { service } = createFixture();

    await expect(service.create(RoleCode.MANAGER, newUser)).resolves.toBe(storedUser);
  });

  it('refuses to create a user whose email is already registered', async () => {
    const { service, userRepository } = createFixture();
    userRepository.findByEmail.mockResolvedValue(storedUser);

    await expect(service.create(RoleCode.MANAGER, newUser)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(userRepository.create).not.toHaveBeenCalled();
  });

  it('changes the active flag of an existing user', async () => {
    const { service, userRepository } = createFixture();

    await service.setActive(8, false);

    expect(userRepository.updateAccount).toHaveBeenCalledWith(8, { active: false });
  });

  it('changes the role of an existing user', async () => {
    const { service, userRepository } = createFixture();

    await service.setRole(8, 5);

    expect(userRepository.updateAccount).toHaveBeenCalledWith(8, { roleId: 5 });
  });

  it('does not update a user that does not exist', async () => {
    const { service, userRepository } = createFixture();
    userRepository.findById.mockResolvedValue(null);

    await expect(service.setActive(99, false)).rejects.toBeInstanceOf(NotFoundException);
    expect(userRepository.updateAccount).not.toHaveBeenCalled();
  });
});
