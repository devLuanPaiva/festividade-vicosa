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
});
