import { NotFoundException } from '@nestjs/common';
import type { CategoryService } from '../../category/services/category.service';
import type { MatchGroupRepository } from '../repository/match-group.repository';
import { MatchGroupService } from './match-group.service';

type RepositoryMock = Record<
  'findByCategory' | 'findById' | 'findByCategoryAndName' | 'create' | 'update' | 'remove',
  jest.Mock
>;

const stored = { id: 1, categoryId: 5, name: 'Grupo A' };

function createFixture(): {
  service: MatchGroupService;
  repository: RepositoryMock;
  categoryService: Record<'findByIdOrFail', jest.Mock>;
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
  const service = new MatchGroupService(
    repository as unknown as MatchGroupRepository,
    categoryService as unknown as CategoryService,
  );
  return { service, repository, categoryService };
}

describe('MatchGroupService queries', () => {
  it('lists the groups of an existing category', async () => {
    const { service } = createFixture();

    await expect(service.listByCategory(5)).resolves.toEqual([stored]);
  });

  it('does not list the groups of a category that does not exist', async () => {
    const { service, categoryService, repository } = createFixture();
    categoryService.findByIdOrFail.mockRejectedValue(new NotFoundException());

    await expect(service.listByCategory(99)).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.findByCategory).not.toHaveBeenCalled();
  });

  it('throws not found with the id field when the group does not exist', async () => {
    const { service, repository } = createFixture();
    repository.findById.mockResolvedValue(null);

    await expect(service.findByIdOrFail(99)).rejects.toMatchObject({
      response: { code: 'GROUP_NOT_FOUND', field: 'id' },
    });
  });
});

describe('MatchGroupService.create', () => {
  it('creates a group inside the category', async () => {
    const { service, repository } = createFixture();

    await service.create(5, { name: 'Grupo B' });

    expect(repository.create).toHaveBeenCalledWith({ categoryId: 5, name: 'Grupo B' });
  });

  it('refuses a repeated name inside the category', async () => {
    const { service, repository } = createFixture();
    repository.findByCategoryAndName.mockResolvedValue(stored);

    await expect(service.create(5, { name: 'Grupo A' })).rejects.toMatchObject({
      response: { code: 'GROUP_NAME_TAKEN', field: 'name' },
    });
    expect(repository.create).not.toHaveBeenCalled();
  });
});

describe('MatchGroupService.update', () => {
  it('renames the group', async () => {
    const { service, repository } = createFixture();

    await service.update(1, { name: 'Grupo B' });

    expect(repository.update).toHaveBeenCalledWith(1, 'Grupo B');
  });

  it('refuses renaming to a name already used in the category', async () => {
    const { service, repository } = createFixture();
    repository.findByCategoryAndName.mockResolvedValue({ ...stored, id: 2 });

    await expect(service.update(1, { name: 'Grupo B' })).rejects.toMatchObject({
      response: { code: 'GROUP_NAME_TAKEN' },
    });
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('does not check the name when it did not change', async () => {
    const { service, repository } = createFixture();

    await service.update(1, { name: 'Grupo A' });

    expect(repository.findByCategoryAndName).not.toHaveBeenCalled();
  });
});

describe('MatchGroupService.remove', () => {
  it('deletes an existing group', async () => {
    const { service, repository } = createFixture();

    await service.remove(1);

    expect(repository.remove).toHaveBeenCalledWith(1);
  });

  it('does not delete a group that does not exist', async () => {
    const { service, repository } = createFixture();
    repository.findById.mockResolvedValue(null);

    await expect(service.remove(99)).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.remove).not.toHaveBeenCalled();
  });
});
