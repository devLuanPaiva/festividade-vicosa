import { ConflictException, NotFoundException } from '@nestjs/common';
import type { UserRoleRepository } from '../../role/repository/user-role.repository';
import type { UserRepository } from '../repository/user.repository';
import type { PasswordHasher } from './password-hasher';
import { UserService } from './user.service';

const USER_ID = '00000000-0000-4000-8000-000000000008';
const OTHER_USER_ID = '00000000-0000-4000-8000-000000000009';
const ROLE_ID = '00000000-0000-4000-8000-000000000003';

type UserRepositoryMock = Record<
  'findAll' | 'findById' | 'findByEmail' | 'create' | 'update',
  jest.Mock
>;

const storedUser = { id: USER_ID, name: 'Ana', email: 'ana@example.com' };

function createFixture(): {
  service: UserService;
  userRepository: UserRepositoryMock;
  userRoleRepository: Record<'findByUserIds' | 'findUserIdsByRoleId', jest.Mock>;
} {
  const userRepository: UserRepositoryMock = {
    findAll: jest.fn().mockResolvedValue([storedUser]),
    findById: jest.fn().mockResolvedValue(storedUser),
    findByEmail: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue(storedUser),
    update: jest.fn().mockResolvedValue(undefined),
  };
  const userRoleRepository = {
    findByUserIds: jest.fn().mockResolvedValue([{ userId: USER_ID, roleId: ROLE_ID }]),
    findUserIdsByRoleId: jest.fn().mockResolvedValue([USER_ID]),
  };
  const service = new UserService(
    userRepository as unknown as UserRepository,
    userRoleRepository as unknown as UserRoleRepository,
    { hash: jest.fn().mockResolvedValue('hashed-password') } as unknown as PasswordHasher,
  );
  return { service, userRepository, userRoleRepository };
}

const newUser = { name: 'Ana', email: 'Ana@Example.com', password: 'a-long-password' };

describe('UserService queries', () => {
  it('throws not found when the user does not exist', async () => {
    const { service, userRepository } = createFixture();
    userRepository.findById.mockResolvedValue(null);

    await expect(service.findByIdOrFail(OTHER_USER_ID)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('lists each user with the groups of that user only', async () => {
    const { service, userRepository, userRoleRepository } = createFixture();
    userRepository.findAll.mockResolvedValue([storedUser, { id: OTHER_USER_ID }]);
    userRoleRepository.findByUserIds.mockResolvedValue([
      { userId: OTHER_USER_ID, roleId: ROLE_ID },
    ]);

    const [first, second] = await service.list({});

    expect(first?.userRoles).toEqual([]);
    expect(second?.userRoles).toHaveLength(1);
  });

  it('filters the list by group through the ids of the users in it', async () => {
    const { service, userRepository } = createFixture();

    await service.list({ roleId: ROLE_ID, active: true });

    expect(userRepository.findAll).toHaveBeenCalledWith({ active: true, ids: [USER_ID] });
  });
});

describe('UserService.create', () => {
  it('creates the user with a hashed password and the group as the primary one', async () => {
    const { service, userRepository } = createFixture();

    await service.create(ROLE_ID, newUser);

    expect(userRepository.create).toHaveBeenCalledWith({
      name: 'Ana',
      email: 'Ana@Example.com',
      passwordHash: 'hashed-password',
      roleId: ROLE_ID,
    });
  });

  it('refuses an email that is already registered', async () => {
    const { service, userRepository } = createFixture();
    userRepository.findByEmail.mockResolvedValue({ id: OTHER_USER_ID });

    await expect(service.create(ROLE_ID, newUser)).rejects.toBeInstanceOf(ConflictException);
    expect(userRepository.create).not.toHaveBeenCalled();
  });
});

describe('UserService.update', () => {
  it('changes only the fields that were sent', async () => {
    const { service, userRepository } = createFixture();

    await service.update(USER_ID, { name: 'Ana Maria', password: 'new-password' });

    expect(userRepository.update).toHaveBeenCalledWith(USER_ID, {
      name: 'Ana Maria',
      passwordHash: 'hashed-password',
    });
  });

  it('stores the email in lower case', async () => {
    const { service, userRepository } = createFixture();

    await service.update(USER_ID, { email: 'ANA@Example.com' });

    expect(userRepository.update).toHaveBeenCalledWith(USER_ID, { email: 'ana@example.com' });
  });

  it('lets the user keep their own email', async () => {
    const { service, userRepository } = createFixture();
    userRepository.findByEmail.mockResolvedValue(storedUser);

    await expect(service.update(USER_ID, { email: 'ana@example.com' })).resolves.toBeDefined();
  });

  it('refuses the email of another user', async () => {
    const { service, userRepository } = createFixture();
    userRepository.findByEmail.mockResolvedValue({ id: OTHER_USER_ID });

    await expect(service.update(USER_ID, { email: 'bia@example.com' })).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(userRepository.update).not.toHaveBeenCalled();
  });

  it('does not write anything when no field was sent', async () => {
    const { service, userRepository } = createFixture();

    await service.update(USER_ID, {});

    expect(userRepository.update).not.toHaveBeenCalled();
  });

  it('does not update a user that does not exist', async () => {
    const { service, userRepository } = createFixture();
    userRepository.findById.mockResolvedValue(null);

    await expect(service.update(OTHER_USER_ID, { name: 'Bia' })).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(userRepository.update).not.toHaveBeenCalled();
  });
});
