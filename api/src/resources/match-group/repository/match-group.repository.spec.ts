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
});
