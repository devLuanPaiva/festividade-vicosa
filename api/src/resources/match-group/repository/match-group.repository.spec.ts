import { ILike, type Repository } from 'typeorm';
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

    await repository.findByCategory('00000000-0000-4000-8000-000000000005', {});

    expect(typeorm.find).toHaveBeenCalledWith({
      where: { categoryId: '00000000-0000-4000-8000-000000000005' },
      order: { name: 'ASC', id: 'ASC' },
    });
  });

  it('filters the groups by name search', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findByCategory('00000000-0000-4000-8000-000000000005', { search: 'grupo' });

    expect(typeorm.find).toHaveBeenCalledWith({
      where: { categoryId: '00000000-0000-4000-8000-000000000005', name: ILike('%grupo%') },
      order: { name: 'ASC', id: 'ASC' },
    });
  });

  it('finds a group by id', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findById('00000000-0000-4000-8000-000000000001');

    expect(typeorm.findOneBy).toHaveBeenCalledWith({ id: '00000000-0000-4000-8000-000000000001' });
  });

  it('finds a group by category and name', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findByCategoryAndName('00000000-0000-4000-8000-000000000005', 'Grupo A');

    expect(typeorm.findOneBy).toHaveBeenCalledWith({
      categoryId: '00000000-0000-4000-8000-000000000005',
      name: 'Grupo A',
    });
  });

  it('saves a new group', async () => {
    const { repository } = createFixture();
    const record = { categoryId: '00000000-0000-4000-8000-000000000005', name: 'Grupo A' };

    await expect(repository.create(record)).resolves.toEqual(record);
  });

  it('renames a group by id', async () => {
    const { repository, typeorm } = createFixture();

    await repository.update('00000000-0000-4000-8000-000000000001', 'Grupo B');

    expect(typeorm.update).toHaveBeenCalledWith(
      { id: '00000000-0000-4000-8000-000000000001' },
      { name: 'Grupo B' },
    );
  });

  it('deletes a group by id', async () => {
    const { repository, typeorm } = createFixture();

    await repository.remove('00000000-0000-4000-8000-000000000001');

    expect(typeorm.delete).toHaveBeenCalledWith({ id: '00000000-0000-4000-8000-000000000001' });
  });
});
