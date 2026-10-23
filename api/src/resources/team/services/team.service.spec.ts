import { NotFoundException } from '@nestjs/common';
import type { CategoryService } from '../../category/services/category.service';
import type { MatchGroupService } from '../../match-group/services/match-group.service';
import type { TeamRepository } from '../repository/team.repository';
import { TeamService } from './team.service';

type RepositoryMock = Record<
  'findByCategory' | 'findById' | 'findByCategoryAndName' | 'create' | 'update' | 'remove',
  jest.Mock
>;

const stored = { id: 7, categoryId: 5, groupId: null, name: 'Centro' };

function createFixture(): {
  service: TeamService;
  repository: RepositoryMock;
  categoryService: Record<'findByIdOrFail', jest.Mock>;
  matchGroupService: Record<'findByIdOrFail', jest.Mock>;
} {
  const repository: RepositoryMock = {
    findByCategory: jest.fn().mockResolvedValue([stored]),
    findById: jest.fn().mockResolvedValue(stored),
    findByCategoryAndName: jest.fn().mockResolvedValue(null),
    create: jest.fn((record: object) => Promise.resolve({ id: 9, ...record })),
    update: jest.fn().mockResolvedValue(undefined),
    remove: jest.fn().mockResolvedValue(undefined),
  };
  const categoryService = { findByIdOrFail: jest.fn().mockResolvedValue({ id: 5 }) };
  const matchGroupService = {
    findByIdOrFail: jest.fn().mockResolvedValue({ id: 1, categoryId: 5 }),
  };
  const service = new TeamService(
    repository as unknown as TeamRepository,
    categoryService as unknown as CategoryService,
    matchGroupService as unknown as MatchGroupService,
  );
  return { service, repository, categoryService, matchGroupService };
}

describe('TeamService queries', () => {
  it('lists the teams of an existing category', async () => {
    const { service } = createFixture();

    await expect(service.listByCategory(5)).resolves.toEqual([stored]);
  });

  it('does not list the teams of a category that does not exist', async () => {
    const { service, categoryService, repository } = createFixture();
    categoryService.findByIdOrFail.mockRejectedValue(new NotFoundException());

    await expect(service.listByCategory(99)).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.findByCategory).not.toHaveBeenCalled();
  });

  it('throws not found with the id field when the team does not exist', async () => {
    const { service, repository } = createFixture();
    repository.findById.mockResolvedValue(null);

    await expect(service.findByIdOrFail(99)).rejects.toMatchObject({
      response: { code: 'TEAM_NOT_FOUND', field: 'id' },
    });
  });
});

describe('TeamService.create', () => {
  it('creates a team without group when none is given', async () => {
    const { service, repository } = createFixture();

    await service.create(5, { name: 'Centro' });

    expect(repository.create).toHaveBeenCalledWith({
      categoryId: 5,
      groupId: null,
      name: 'Centro',
    });
  });

  it('creates a team inside a group of the same category (RN-13)', async () => {
    const { service, repository } = createFixture();

    await service.create(5, { name: 'Centro', groupId: 1 });

    expect(repository.create).toHaveBeenCalledWith({ categoryId: 5, groupId: 1, name: 'Centro' });
  });

  it('refuses a group of another category pointing at the group field', async () => {
    const { service, matchGroupService, repository } = createFixture();
    matchGroupService.findByIdOrFail.mockResolvedValue({ id: 2, categoryId: 6 });

    await expect(service.create(5, { name: 'Centro', groupId: 2 })).rejects.toMatchObject({
      response: { code: 'GROUP_NOT_IN_CATEGORY', field: 'groupId' },
    });
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('refuses a repeated name inside the category', async () => {
    const { service, repository } = createFixture();
    repository.findByCategoryAndName.mockResolvedValue(stored);

    await expect(service.create(5, { name: 'Centro' })).rejects.toMatchObject({
      response: { code: 'TEAM_NAME_TAKEN', field: 'name' },
    });
    expect(repository.create).not.toHaveBeenCalled();
  });
});

describe('TeamService.update', () => {
  it('moves the team to another group of the category', async () => {
    const { service, repository } = createFixture();

    await service.update(7, { groupId: 1 });

    expect(repository.update).toHaveBeenCalledWith(7, { groupId: 1 });
  });

  it('takes the team out of its group when the group is null', async () => {
    const { service, repository, matchGroupService } = createFixture();

    await service.update(7, { groupId: null });

    expect(matchGroupService.findByIdOrFail).not.toHaveBeenCalled();
    expect(repository.update).toHaveBeenCalledWith(7, { groupId: null });
  });

  it('refuses moving the team to a group of another category', async () => {
    const { service, matchGroupService, repository } = createFixture();
    matchGroupService.findByIdOrFail.mockResolvedValue({ id: 2, categoryId: 6 });

    await expect(service.update(7, { groupId: 2 })).rejects.toMatchObject({
      response: { code: 'GROUP_NOT_IN_CATEGORY' },
    });
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('refuses renaming to a name already used in the category', async () => {
    const { service, repository } = createFixture();
    repository.findByCategoryAndName.mockResolvedValue({ ...stored, id: 8 });

    await expect(service.update(7, { name: 'Norte' })).rejects.toMatchObject({
      response: { code: 'TEAM_NAME_TAKEN' },
    });
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('does not check the name when it did not change', async () => {
    const { service, repository } = createFixture();

    await service.update(7, { name: 'Centro' });

    expect(repository.findByCategoryAndName).not.toHaveBeenCalled();
  });
});

describe('TeamService.remove', () => {
  it('deletes an existing team', async () => {
    const { service, repository } = createFixture();

    await service.remove(7);

    expect(repository.remove).toHaveBeenCalledWith(7);
  });

  it('does not delete a team that does not exist', async () => {
    const { service, repository } = createFixture();
    repository.findById.mockResolvedValue(null);

    await expect(service.remove(99)).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.remove).not.toHaveBeenCalled();
  });
});
