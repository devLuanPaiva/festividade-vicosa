import { ConflictException, NotFoundException } from '@nestjs/common';
import type { EditionRepository } from '../repository/edition.repository';
import { EditionService } from './edition.service';

type RepositoryMock = Record<
  'findAll' | 'findById' | 'findByYear' | 'create' | 'update',
  jest.Mock
>;

const stored = {
  id: '00000000-0000-4000-8000-000000000001',
  year: 2026,
  name: 'Festividade 2026',
  description: null,
};

function createFixture(): { service: EditionService; repository: RepositoryMock } {
  const repository: RepositoryMock = {
    findAll: jest.fn().mockResolvedValue([stored]),
    findById: jest.fn().mockResolvedValue(stored),
    findByYear: jest.fn().mockResolvedValue(null),
    create: jest.fn((record: object) =>
      Promise.resolve({ id: '00000000-0000-4000-8000-000000000002', ...record }),
    ),
    update: jest.fn().mockResolvedValue(undefined),
  };
  return { service: new EditionService(repository as unknown as EditionRepository), repository };
}

describe('EditionService', () => {
  it('lists the editions', async () => {
    const { service } = createFixture();

    await expect(service.list({})).resolves.toEqual([stored]);
  });

  it('returns an existing edition', async () => {
    const { service } = createFixture();

    await expect(service.findByIdOrFail('00000000-0000-4000-8000-000000000001')).resolves.toBe(
      stored,
    );
  });

  it('throws not found with the id field when the edition does not exist', async () => {
    const { service, repository } = createFixture();
    repository.findById.mockResolvedValue(null);

    await expect(
      service.findByIdOrFail('00000000-0000-4000-8000-000000000009'),
    ).rejects.toMatchObject({
      response: { code: 'EDITION_NOT_FOUND', field: 'id' },
    });
    await expect(
      service.findByIdOrFail('00000000-0000-4000-8000-000000000009'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('creates an edition and stores a missing description as null', async () => {
    const { service, repository } = createFixture();

    await service.create({ year: 2027, name: 'Festividade 2027' });

    expect(repository.create).toHaveBeenCalledWith({
      year: 2027,
      name: 'Festividade 2027',
      description: null,
    });
  });

  it('refuses a second edition for the same year', async () => {
    const { service, repository } = createFixture();
    repository.findByYear.mockResolvedValue(stored);

    await expect(service.create({ year: 2026, name: 'Outra' })).rejects.toMatchObject({
      response: { code: 'EDITION_YEAR_TAKEN', field: 'year' },
    });
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('updates the name without checking the year', async () => {
    const { service, repository } = createFixture();

    await service.update('00000000-0000-4000-8000-000000000001', { name: 'Novo nome' });

    expect(repository.findByYear).not.toHaveBeenCalled();
    expect(repository.update).toHaveBeenCalledWith('00000000-0000-4000-8000-000000000001', {
      name: 'Novo nome',
    });
  });

  it('allows an update that keeps the same year', async () => {
    const { service, repository } = createFixture();

    await service.update('00000000-0000-4000-8000-000000000001', { year: 2026 });

    expect(repository.findByYear).not.toHaveBeenCalled();
  });

  it('refuses to move an edition to a year that is already taken', async () => {
    const { service, repository } = createFixture();
    repository.findByYear.mockResolvedValue({
      id: '00000000-0000-4000-8000-000000000005',
      year: 2027,
    });

    await expect(
      service.update('00000000-0000-4000-8000-000000000001', { year: 2027 }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(repository.update).not.toHaveBeenCalled();
  });
});
