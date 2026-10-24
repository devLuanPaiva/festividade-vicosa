import { ILike, type Repository } from 'typeorm';
import { RoleCode } from '../../role/enums/role-code.enum';
import type { User } from '../entities/user.entity';
import { UserRepository } from './user.repository';

type TypeOrmMock = Record<
  'find' | 'findOne' | 'findOneBy' | 'create' | 'save' | 'update',
  jest.Mock
>;

function createFixture(): { repository: UserRepository; typeorm: TypeOrmMock } {
  const typeorm: TypeOrmMock = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn((entity: Partial<User>) => entity),
    save: jest.fn((entity: Partial<User>) => Promise.resolve(entity)),
    update: jest.fn(),
  };
  return { repository: new UserRepository(typeorm as unknown as Repository<User>), typeorm };
}

describe('UserRepository', () => {
  it('filters the users by active flag and role', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findAll({ active: false, roleCode: RoleCode.MANAGER });

    expect(typeorm.find).toHaveBeenCalledWith(
      expect.objectContaining({ where: [{ active: false, role: { code: RoleCode.MANAGER } }] }),
    );
  });

  it('searches the text in the name or in the e-mail', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findAll({ search: 'ana' });

    expect(typeorm.find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: [{ name: ILike('%ana%') }, { email: ILike('%ana%') }],
      }),
    );
  });

  it('finds a user by email ignoring the letter case and the active flag', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findByEmail('Ana@Example.COM');

    expect(typeorm.findOneBy).toHaveBeenCalledWith({ email: 'ana@example.com' });
  });

  it('finds an active user by email ignoring the letter case', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findActiveByEmail('Admin@Example.COM');

    expect(typeorm.findOneBy).toHaveBeenCalledWith({ email: 'admin@example.com', active: true });
  });

  it('finds an active user by id', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findActiveById('00000000-0000-4000-8000-000000000005');

    expect(typeorm.findOneBy).toHaveBeenCalledWith({
      id: '00000000-0000-4000-8000-000000000005',
      active: true,
    });
  });

  it('saves a new user with a lower case email', async () => {
    const { repository } = createFixture();

    const user = await repository.create({
      name: 'Ana',
      email: 'Ana@Example.com',
      passwordHash: 'hashed',
      roleId: '00000000-0000-4000-8000-000000000003',
    });

    expect(user).toEqual({
      name: 'Ana',
      email: 'ana@example.com',
      passwordHash: 'hashed',
      roleId: '00000000-0000-4000-8000-000000000003',
    });
  });
});
