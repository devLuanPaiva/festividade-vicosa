import type { Repository } from 'typeorm';
import type { SubEvent } from '../entities/sub-event.entity';
import { SubEventType } from '../enums/sub-event-type.enum';
import { SubEventRepository } from './sub-event.repository';

type TypeOrmMock = Record<'find' | 'findOneBy' | 'create' | 'save' | 'update', jest.Mock>;

function createFixture(): { repository: SubEventRepository; typeorm: TypeOrmMock } {
  const typeorm: TypeOrmMock = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn((entity: Partial<SubEvent>) => entity),
    save: jest.fn((entity: Partial<SubEvent>) => Promise.resolve(entity)),
    update: jest.fn(),
  };
  return {
    repository: new SubEventRepository(typeorm as unknown as Repository<SubEvent>),
    typeorm,
  };
}

describe('SubEventRepository', () => {
  it('lists the sub-events of an edition ordered by start date', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findByEdition('00000000-0000-4000-8000-000000000001', {});

    expect(typeorm.find).toHaveBeenCalledWith({
      where: { editionId: '00000000-0000-4000-8000-000000000001' },
      order: { startDate: 'ASC', id: 'ASC' },
    });
  });

  it('filters the sub-events by type', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findByEdition('00000000-0000-4000-8000-000000000001', {
      type: SubEventType.JOCEV_FUTSAL,
    });

    expect(typeorm.find).toHaveBeenCalledWith({
      where: { editionId: '00000000-0000-4000-8000-000000000001', type: SubEventType.JOCEV_FUTSAL },
      order: { startDate: 'ASC', id: 'ASC' },
    });
  });

  it('finds a sub-event by id', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findById('00000000-0000-4000-8000-000000000004');

    expect(typeorm.findOneBy).toHaveBeenCalledWith({ id: '00000000-0000-4000-8000-000000000004' });
  });

  it('finds a sub-event by edition and type', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findByEditionAndType(
      '00000000-0000-4000-8000-000000000001',
      SubEventType.ECOPEDAL,
    );

    expect(typeorm.findOneBy).toHaveBeenCalledWith({
      editionId: '00000000-0000-4000-8000-000000000001',
      type: SubEventType.ECOPEDAL,
    });
  });

  it('saves a new sub-event', async () => {
    const { repository } = createFixture();
    const record = {
      editionId: '00000000-0000-4000-8000-000000000001',
      type: SubEventType.ECOPEDAL,
      name: 'Ecopedal',
      description: null,
      startDate: '2026-12-20',
      endDate: '2026-12-20',
      location: null,
    };

    await expect(repository.create(record)).resolves.toEqual(record);
  });

  it('updates a sub-event by id', async () => {
    const { repository, typeorm } = createFixture();

    await repository.update('00000000-0000-4000-8000-000000000004', { location: 'Praça central' });

    expect(typeorm.update).toHaveBeenCalledWith(
      { id: '00000000-0000-4000-8000-000000000004' },
      { location: 'Praça central' },
    );
  });
});
