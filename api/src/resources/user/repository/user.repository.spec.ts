import type { Repository } from 'typeorm';
import type { User } from '../entities/user.entity';
import { UserRepository } from './user.repository';

function createFixture(): {
  repository: UserRepository;
  typeorm: Record<'findOneBy' | 'count' | 'create' | 'save', jest.Mock>;
} {
  const typeorm = {
    findOneBy: jest.fn(),
    count: jest.fn(),
    create: jest.fn((entity: Partial<User>) => entity),
    save: jest.fn((entity: Partial<User>) => Promise.resolve(entity)),
  };
  return { repository: new UserRepository(typeorm as unknown as Repository<User>), typeorm };
}

describe('UserRepository', () => {
  it('finds an active user by email ignoring the letter case', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findActiveByEmail('Admin@Example.COM');

    expect(typeorm.findOneBy).toHaveBeenCalledWith({ email: 'admin@example.com', active: true });
  });

  it('finds an active user by id', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findActiveById(5);

    expect(typeorm.findOneBy).toHaveBeenCalledWith({ id: 5, active: true });
  });

  it('counts the registered users', async () => {
    const { repository, typeorm } = createFixture();
    typeorm.count.mockResolvedValue(2);

    await expect(repository.count()).resolves.toBe(2);
  });

  it('saves a new user with a lower case email', async () => {
    const { repository } = createFixture();

    const user = await repository.create({
      name: 'Ana',
      email: 'Ana@Example.com',
      passwordHash: 'hashed',
      roleId: 3,
    });

    expect(user).toEqual({
      name: 'Ana',
      email: 'ana@example.com',
      passwordHash: 'hashed',
      roleId: 3,
    });
  });
});
