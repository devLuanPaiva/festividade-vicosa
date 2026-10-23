import type { Repository } from 'typeorm';
import type { MatchGroup } from '../entities/match-group.entity';
import { MatchGroupRepository } from './match-group.repository';

type TypeOrmMock = Record<
  'find' | 'findOneBy' | 'create' | 'save' | 'update' | 'delete',
  jest.Mock
>;

function createFixture(): { repository: MatchGroupRepository; typeorm: TypeOrmMock } {
  const typeorm: TypeOrmMock = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn((entity: Partial<MatchGroup>) => entity),
    save: jest.fn((entity: Partial<MatchGroup>) => Promise.resolve(entity)),
    update: jest.fn(),
    delete: jest.fn(),
  };
  return {
    repository: new MatchGroupRepository(typeorm as unknown as Repository<MatchGroup>),
    typeorm,
  };
}

describe('MatchGroupRepository', () => {
  it('lists the groups of a category ordered by name', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findByCategory(5);

    expect(typeorm.find).toHaveBeenCalledWith({
      where: { categoryId: 5 },
      order: { name: 'ASC', id: 'ASC' },
    });
  });

  it('finds a group by id', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findById(1);

    expect(typeorm.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('finds a group by category and name', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findByCategoryAndName(5, 'Grupo A');

    expect(typeorm.findOneBy).toHaveBeenCalledWith({ categoryId: 5, name: 'Grupo A' });
  });

  it('saves a new group', async () => {
    const { repository } = createFixture();
    const record = { categoryId: 5, name: 'Grupo A' };

    await expect(repository.create(record)).resolves.toEqual(record);
  });

  it('renames a group by id', async () => {
    const { repository, typeorm } = createFixture();

    await repository.update(1, 'Grupo B');

    expect(typeorm.update).toHaveBeenCalledWith({ id: 1 }, { name: 'Grupo B' });
  });

  it('deletes a group by id', async () => {
    const { repository, typeorm } = createFixture();

    await repository.remove(1);

    expect(typeorm.delete).toHaveBeenCalledWith({ id: 1 });
  });
});
