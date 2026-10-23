import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import type { EditionService } from '../../edition/services/edition.service';
import { SubEventType } from '../enums/sub-event-type.enum';
import type { SubEventRepository } from '../repository/sub-event.repository';
import { SubEventService } from './sub-event.service';

type RepositoryMock = Record<
  'findByEdition' | 'findById' | 'findByEditionAndType' | 'create' | 'update',
  jest.Mock
>;

const stored = {
  id: '00000000-0000-4000-8000-000000000004',
  editionId: '00000000-0000-4000-8000-000000000001',
  type: SubEventType.JOCEV_FUTSAL,
  startDate: '2026-12-09',
  endDate: '2026-12-19',
};

const newSubEvent = {
  type: SubEventType.ECOPEDAL,
  name: 'Ecopedal',
  startDate: '2026-12-20',
  endDate: '2026-12-20',
};

function createFixture(): {
  service: SubEventService;
  repository: RepositoryMock;
  editionService: Record<'findByIdOrFail', jest.Mock>;
} {
  const repository: RepositoryMock = {
    findByEdition: jest.fn().mockResolvedValue([stored]),
    findById: jest.fn().mockResolvedValue(stored),
    findByEditionAndType: jest.fn().mockResolvedValue(null),
    create: jest.fn((record: object) =>
      Promise.resolve({ id: '00000000-0000-4000-8000-000000000009', ...record }),
    ),
    update: jest.fn().mockResolvedValue(undefined),
  };
  const editionService = {
    findByIdOrFail: jest.fn().mockResolvedValue({ id: '00000000-0000-4000-8000-000000000001' }),
  };
  const service = new SubEventService(
    repository as unknown as SubEventRepository,
    editionService as unknown as EditionService,
  );
  return { service, repository, editionService };
}

describe('SubEventService queries', () => {
  it('lists the sub-events of an existing edition', async () => {
    const { service } = createFixture();

    await expect(
      service.listByEdition('00000000-0000-4000-8000-000000000001', {}),
    ).resolves.toEqual([stored]);
  });

  it('does not list the sub-events of an edition that does not exist', async () => {
    const { service, editionService, repository } = createFixture();
    editionService.findByIdOrFail.mockRejectedValue(new NotFoundException());

    await expect(
      service.listByEdition('00000000-0000-4000-8000-000000000099', {}),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.findByEdition).not.toHaveBeenCalled();
  });

  it('throws not found with the id field when the sub-event does not exist', async () => {
    const { service, repository } = createFixture();
    repository.findById.mockResolvedValue(null);

    await expect(
      service.findByIdOrFail('00000000-0000-4000-8000-000000000099'),
    ).rejects.toMatchObject({
      response: { code: 'SUB_EVENT_NOT_FOUND', field: 'id' },
    });
  });
});

describe('SubEventService.create', () => {
  it('creates a sub-event with null for the optional fields', async () => {
    const { service, repository } = createFixture();

    await service.create('00000000-0000-4000-8000-000000000001', newSubEvent);

    expect(repository.create).toHaveBeenCalledWith({
      editionId: '00000000-0000-4000-8000-000000000001',
      ...newSubEvent,
      description: null,
      location: null,
    });
  });

  it('refuses an end date before the start date pointing at the end date field', async () => {
    const { service, repository } = createFixture();

    await expect(
      service.create('00000000-0000-4000-8000-000000000001', {
        ...newSubEvent,
        startDate: '2026-12-20',
        endDate: '2026-12-19',
      }),
    ).rejects.toMatchObject({ response: { code: 'INVALID_DATE_RANGE', field: 'endDate' } });
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('refuses a second sub-event of the same type in the edition', async () => {
    const { service, repository } = createFixture();
    repository.findByEditionAndType.mockResolvedValue(stored);

    await expect(
      service.create('00000000-0000-4000-8000-000000000001', newSubEvent),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(repository.create).not.toHaveBeenCalled();
  });
});

describe('SubEventService.update', () => {
  it('updates the given fields', async () => {
    const { service, repository } = createFixture();

    await service.update('00000000-0000-4000-8000-000000000004', { location: 'Ginásio municipal' });

    expect(repository.update).toHaveBeenCalledWith('00000000-0000-4000-8000-000000000004', {
      location: 'Ginásio municipal',
    });
  });

  it('validates a new end date against the stored start date', async () => {
    const { service, repository } = createFixture();

    await expect(
      service.update('00000000-0000-4000-8000-000000000004', { endDate: '2026-12-01' }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('validates a new start date against the stored end date', async () => {
    const { service } = createFixture();

    await expect(
      service.update('00000000-0000-4000-8000-000000000004', { startDate: '2026-12-25' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
