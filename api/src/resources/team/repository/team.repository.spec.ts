import { ILike, type Repository } from 'typeorm';
import type { Team } from '../entities/team.entity';
import { TeamRepository } from './team.repository';

type TypeOrmMock = Record<
  'find' | 'findOneBy' | 'create' | 'save' | 'update' | 'delete',
  jest.Mock
>;

const TEAM_ID = '00000000-0000-4000-8000-000000000007';
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

describe('TeamRepository', () => {
  it('finds a team by id', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findById(TEAM_ID);

    expect(typeorm.findOneBy).toHaveBeenCalledWith({ id: TEAM_ID });
  });

  it('finds a team by category and name', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findByCategoryAndName(CATEGORY_ID, 'Centro');

    expect(typeorm.findOneBy).toHaveBeenCalledWith({ categoryId: CATEGORY_ID, name: 'Centro' });
  });

  it('finds a team by category and slug', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findByCategoryAndSlug(CATEGORY_ID, 'centro');

    expect(typeorm.findOneBy).toHaveBeenCalledWith({ categoryId: CATEGORY_ID, slug: 'centro' });
  });

  it('saves a new team', async () => {
    const { repository } = createFixture();
    const record = {
      categoryId: CATEGORY_ID,
      groupId: null,
      name: 'Centro',
      slug: 'centro',
      city: 'Viçosa',
      abbreviation: null,
      photoKey: null,
    };

    await expect(repository.create(record)).resolves.toEqual(record);
  });

  it('updates a team by id', async () => {
    const { repository, typeorm } = createFixture();

    await repository.update(TEAM_ID, { groupId: null });

    expect(typeorm.update).toHaveBeenCalledWith({ id: TEAM_ID }, { groupId: null });
  });

  it('deletes a team by id', async () => {
    const { repository, typeorm } = createFixture();

    await repository.remove(TEAM_ID);

    expect(typeorm.delete).toHaveBeenCalledWith({ id: TEAM_ID });
  });
});
