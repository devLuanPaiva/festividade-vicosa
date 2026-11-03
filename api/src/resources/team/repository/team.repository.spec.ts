import { ILike, type Repository } from 'typeorm';
import type { Team } from '../entities/team.entity';
import { TeamRepository } from './team.repository';

type TypeOrmMock = Record<
  'find' | 'findOneBy' | 'create' | 'save' | 'update' | 'delete',
  jest.Mock
>;

const CATEGORY_ID = '00000000-0000-4000-8000-000000000005';
const GROUP_ID = '00000000-0000-4000-8000-000000000001';

function createFixture(): { repository: TeamRepository; typeorm: TypeOrmMock } {
  const typeorm: TypeOrmMock = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn((entity: Partial<Team>) => entity),
    save: jest.fn((entity: Partial<Team>) => Promise.resolve(entity)),
    update: jest.fn(),
    delete: jest.fn(),
  };
  return {
    repository: new TeamRepository(typeorm as unknown as Repository<Team>),
    typeorm,
  };
}

describe('TeamRepository.findByCategory', () => {
  it('lists the teams of a category ordered by name when there are no filters', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findByCategory(CATEGORY_ID, {});

    expect(typeorm.find).toHaveBeenCalledWith({
      where: { categoryId: CATEGORY_ID },
      order: { name: 'ASC', id: 'ASC' },
    });
  });

  it('filters by group, city and name search', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findByCategory(CATEGORY_ID, {
      groupId: GROUP_ID,
      city: 'Viçosa',
      search: 'cen',
    });

    expect(typeorm.find).toHaveBeenCalledWith({
      where: {
        categoryId: CATEGORY_ID,
        groupId: GROUP_ID,
        city: ILike('%Viçosa%'),
        name: ILike('%cen%'),
      },
      order: { name: 'ASC', id: 'ASC' },
    });
  });
});
