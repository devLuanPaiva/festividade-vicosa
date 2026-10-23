import type { Repository } from 'typeorm';
import type { Team } from '../entities/team.entity';
import { TeamRepository } from './team.repository';

type TypeOrmMock = Record<
  'find' | 'findOneBy' | 'create' | 'save' | 'update' | 'delete',
  jest.Mock
>;

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

describe('TeamRepository', () => {
  it('lists the teams of a category ordered by name', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findByCategory(5);

    expect(typeorm.find).toHaveBeenCalledWith({
      where: { categoryId: 5 },
      order: { name: 'ASC', id: 'ASC' },
    });
  });

  it('finds a team by id', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findById(7);

    expect(typeorm.findOneBy).toHaveBeenCalledWith({ id: 7 });
  });

  it('finds a team by category and name', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findByCategoryAndName(5, 'Centro');

    expect(typeorm.findOneBy).toHaveBeenCalledWith({ categoryId: 5, name: 'Centro' });
  });

  it('saves a new team', async () => {
    const { repository } = createFixture();
    const record = { categoryId: 5, groupId: null, name: 'Centro' };

    await expect(repository.create(record)).resolves.toEqual(record);
  });

  it('updates a team by id', async () => {
    const { repository, typeorm } = createFixture();

    await repository.update(7, { groupId: null });

    expect(typeorm.update).toHaveBeenCalledWith({ id: 7 }, { groupId: null });
  });

  it('deletes a team by id', async () => {
    const { repository, typeorm } = createFixture();

    await repository.remove(7);

    expect(typeorm.delete).toHaveBeenCalledWith({ id: 7 });
  });
});
