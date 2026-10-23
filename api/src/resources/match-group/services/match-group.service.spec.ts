import { ConflictException, NotFoundException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import type { CategoryService } from '../../category/services/category.service';
import type { MatchGroupRepository } from '../repository/match-group.repository';
import { MatchGroupService } from './match-group.service';

type RepositoryMock = Record<
  'findByCategory' | 'findById' | 'findByCategoryAndName' | 'create' | 'update' | 'remove',
  jest.Mock
>;

const stored = {
  id: '00000000-0000-4000-8000-000000000001',
  categoryId: '00000000-0000-4000-8000-000000000005',
  name: 'Grupo A',
};

function createFixture(): {
  service: MatchGroupService;
  repository: RepositoryMock;
  categoryService: Record<'findByIdOrFail', jest.Mock>;
} {
  const repository: RepositoryMock = {
    findByCategory: jest.fn().mockResolvedValue([stored]),
    findById: jest.fn().mockResolvedValue(stored),
    findByCategoryAndName: jest.fn().mockResolvedValue(null),
    create: jest.fn((record: object) =>
      Promise.resolve({ id: '00000000-0000-4000-8000-000000000009', ...record }),
    ),
    update: jest.fn().mockResolvedValue(undefined),
    remove: jest.fn().mockResolvedValue(undefined),
  };
  const categoryService = {
    findByIdOrFail: jest.fn().mockResolvedValue({ id: '00000000-0000-4000-8000-000000000005' }),
  };
  const service = new MatchGroupService(
    repository as unknown as MatchGroupRepository,
    categoryService as unknown as CategoryService,
  );
  return { service, repository, categoryService };
}

describe('MatchGroupService queries', () => {
  it('does not list the groups of a category that does not exist', async () => {
    const { service, categoryService, repository } = createFixture();
    categoryService.findByIdOrFail.mockRejectedValue(new NotFoundException());

    await expect(
      service.listByCategory('00000000-0000-4000-8000-000000000099', {}),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.findByCategory).not.toHaveBeenCalled();
  });

  it('throws not found with the id field when the group does not exist', async () => {
    const { service, repository } = createFixture();
    repository.findById.mockResolvedValue(null);

    await expect(
      service.findByIdOrFail('00000000-0000-4000-8000-000000000099'),
    ).rejects.toMatchObject({
      response: { code: 'GROUP_NOT_FOUND', field: 'id' },
    });
  });
});

describe('MatchGroupService.create', () => {
  it('creates a group inside the category', async () => {
    const { service, repository } = createFixture();

    await service.create('00000000-0000-4000-8000-000000000005', { name: 'Grupo B' });

    expect(repository.create).toHaveBeenCalledWith({
      categoryId: '00000000-0000-4000-8000-000000000005',
      name: 'Grupo B',
    });
  });

  it('refuses a repeated name inside the category', async () => {
    const { service, repository } = createFixture();
    repository.findByCategoryAndName.mockResolvedValue(stored);

    await expect(
      service.create('00000000-0000-4000-8000-000000000005', { name: 'Grupo A' }),
    ).rejects.toMatchObject({
      response: { code: 'GROUP_NAME_TAKEN', field: 'name' },
    });
    expect(repository.create).not.toHaveBeenCalled();
  });
});

describe('MatchGroupService.update', () => {
  it('renames the group', async () => {
    const { service, repository } = createFixture();

    await service.update('00000000-0000-4000-8000-000000000001', { name: 'Grupo B' });

    expect(repository.update).toHaveBeenCalledWith(
      '00000000-0000-4000-8000-000000000001',
      'Grupo B',
    );
  });

  it('refuses renaming to a name already used in the category', async () => {
    const { service, repository } = createFixture();
    repository.findByCategoryAndName.mockResolvedValue({
      ...stored,
      id: '00000000-0000-4000-8000-000000000002',
    });

    await expect(
      service.update('00000000-0000-4000-8000-000000000001', { name: 'Grupo B' }),
    ).rejects.toMatchObject({
      response: { code: 'GROUP_NAME_TAKEN' },
    });
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('does not check the name when it did not change', async () => {
    const { service, repository } = createFixture();

    await service.update('00000000-0000-4000-8000-000000000001', { name: 'Grupo A' });

    expect(repository.findByCategoryAndName).not.toHaveBeenCalled();
  });
});

describe('MatchGroupService.remove', () => {
  it('deletes an existing group', async () => {
    const { service, repository } = createFixture();

    await service.remove('00000000-0000-4000-8000-000000000001');

    expect(repository.remove).toHaveBeenCalledWith('00000000-0000-4000-8000-000000000001');
  });

  it('explains that a group with matches cannot be deleted', async () => {
    const { service, repository } = createFixture();
    repository.remove.mockRejectedValue(
      new QueryFailedError('DELETE', [], Object.assign(new Error('fk'), { code: '23503' })),
    );

    const failure = service.remove('00000000-0000-4000-8000-000000000001');

    await expect(failure).rejects.toBeInstanceOf(ConflictException);
    await expect(failure).rejects.toMatchObject({ response: { code: 'GROUP_HAS_MATCHES' } });
  });

  it('does not delete a group that does not exist', async () => {
    const { service, repository } = createFixture();
    repository.findById.mockResolvedValue(null);

    await expect(service.remove('00000000-0000-4000-8000-000000000099')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(repository.remove).not.toHaveBeenCalled();
  });
});
