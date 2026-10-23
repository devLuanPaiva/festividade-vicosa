import { NotFoundException } from '@nestjs/common';
import { SubEventType } from '../../sub-event/enums/sub-event-type.enum';
import type { SubEventService } from '../../sub-event/services/sub-event.service';
import { Gender } from '../enums/gender.enum';
import type { CategoryRepository } from '../repository/category.repository';
import { CategoryService } from './category.service';

type RepositoryMock = Record<
  'findBySubEvent' | 'findById' | 'findBySubEventAndName' | 'create' | 'update',
  jest.Mock
>;

const stored = {
  id: '00000000-0000-4000-8000-000000000005',
  subEventId: '00000000-0000-4000-8000-000000000002',
  name: 'Adulto',
  gender: Gender.MALE,
  ageRange: null,
};
const newCategory = { name: 'Sub-13', gender: Gender.MALE };

function createFixture(): {
  service: CategoryService;
  repository: RepositoryMock;
  subEventService: Record<'findByIdOrFail', jest.Mock>;
} {
  const repository: RepositoryMock = {
    findBySubEvent: jest.fn().mockResolvedValue([stored]),
    findById: jest.fn().mockResolvedValue(stored),
    findBySubEventAndName: jest.fn().mockResolvedValue(null),
    create: jest.fn((record: object) =>
      Promise.resolve({ id: '00000000-0000-4000-8000-000000000009', ...record }),
    ),
    update: jest.fn().mockResolvedValue(undefined),
  };
  const subEventService = {
    findByIdOrFail: jest.fn().mockResolvedValue({
      id: '00000000-0000-4000-8000-000000000002',
      type: SubEventType.JOCEV_FUTSAL,
    }),
  };
  const service = new CategoryService(
    repository as unknown as CategoryRepository,
    subEventService as unknown as SubEventService,
  );
  return { service, repository, subEventService };
}

describe('CategoryService queries', () => {
  it('lists the categories of an existing sub-event', async () => {
    const { service } = createFixture();

    await expect(
      service.listBySubEvent('00000000-0000-4000-8000-000000000002', {}),
    ).resolves.toEqual([stored]);
  });

  it('does not list the categories of a sub-event that does not exist', async () => {
    const { service, subEventService, repository } = createFixture();
    subEventService.findByIdOrFail.mockRejectedValue(new NotFoundException());

    await expect(
      service.listBySubEvent('00000000-0000-4000-8000-000000000099', {}),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.findBySubEvent).not.toHaveBeenCalled();
  });

  it('throws not found with the id field when the category does not exist', async () => {
    const { service, repository } = createFixture();
    repository.findById.mockResolvedValue(null);

    await expect(
      service.findByIdOrFail('00000000-0000-4000-8000-000000000099'),
    ).rejects.toMatchObject({
      response: { code: 'CATEGORY_NOT_FOUND', field: 'id' },
    });
  });
});

describe('CategoryService.create', () => {
  it('creates a category with a null age range when none is given', async () => {
    const { service, repository } = createFixture();

    await service.create('00000000-0000-4000-8000-000000000002', newCategory);

    expect(repository.create).toHaveBeenCalledWith({
      subEventId: '00000000-0000-4000-8000-000000000002',
      ...newCategory,
      ageRange: null,
    });
  });

  it('keeps the age range when it is given', async () => {
    const { service, repository } = createFixture();

    await service.create('00000000-0000-4000-8000-000000000002', {
      ...newCategory,
      ageRange: 'Sub-13',
    });

    expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({ ageRange: 'Sub-13' }));
  });

  it('refuses a sub-event without championship (RN-03)', async () => {
    const { service, subEventService, repository } = createFixture();
    subEventService.findByIdOrFail.mockResolvedValue({
      id: '00000000-0000-4000-8000-000000000006',
      type: SubEventType.ECOPEDAL,
    });

    await expect(
      service.create('00000000-0000-4000-8000-000000000006', newCategory),
    ).rejects.toMatchObject({
      response: { code: 'SUB_EVENT_WITHOUT_CHAMPIONSHIP', field: 'subEventId' },
    });
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('refuses a repeated name inside the sub-event', async () => {
    const { service, repository } = createFixture();
    repository.findBySubEventAndName.mockResolvedValue(stored);

    await expect(
      service.create('00000000-0000-4000-8000-000000000002', newCategory),
    ).rejects.toMatchObject({
      response: { code: 'CATEGORY_NAME_TAKEN', field: 'name' },
    });
    expect(repository.create).not.toHaveBeenCalled();
  });
});

describe('CategoryService.update', () => {
  it('updates the given fields', async () => {
    const { service, repository } = createFixture();

    await service.update('00000000-0000-4000-8000-000000000005', { ageRange: 'Principal' });

    expect(repository.update).toHaveBeenCalledWith('00000000-0000-4000-8000-000000000005', {
      ageRange: 'Principal',
    });
  });

  it('refuses renaming to a name already used in the sub-event', async () => {
    const { service, repository } = createFixture();
    repository.findBySubEventAndName.mockResolvedValue({
      ...stored,
      id: '00000000-0000-4000-8000-000000000006',
    });

    await expect(
      service.update('00000000-0000-4000-8000-000000000005', { name: 'Sub-13' }),
    ).rejects.toMatchObject({
      response: { code: 'CATEGORY_NAME_TAKEN' },
    });
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('does not check the name when it did not change', async () => {
    const { service, repository } = createFixture();

    await service.update('00000000-0000-4000-8000-000000000005', { name: 'Adulto' });

    expect(repository.findBySubEventAndName).not.toHaveBeenCalled();
    expect(repository.update).toHaveBeenCalled();
  });
});
