import { IS_PUBLIC_KEY, REQUIRED_PERMISSIONS_KEY } from '../../auth/decorators/decorators';
import { Permission } from '../../role/enums/permission.enum';
import type { SubEvent } from '../entities/sub-event.entity';
import { SubEventType } from '../enums/sub-event-type.enum';
import type { SubEventService } from '../services/sub-event.service';
import { SubEventController } from './sub-event.controller';

const stored: SubEvent = {
  id: '00000000-0000-4000-8000-000000000004',
  editionId: '00000000-0000-4000-8000-000000000001',
  type: SubEventType.ECOPEDAL,
  name: 'Ecopedal',
  description: null,
  startDate: '2026-12-20',
  endDate: '2026-12-20',
  location: null,
};

function createController(): {
  controller: SubEventController;
  service: Record<'listByEdition' | 'findByIdOrFail' | 'create' | 'update', jest.Mock>;
} {
  const service = {
    listByEdition: jest.fn().mockResolvedValue([stored]),
    findByIdOrFail: jest.fn().mockResolvedValue(stored),
    create: jest.fn().mockResolvedValue(stored),
    update: jest.fn().mockResolvedValue(stored),
  };
  return { controller: new SubEventController(service as unknown as SubEventService), service };
}

describe('SubEventController', () => {
  it('lists the sub-events of an edition as response dtos', async () => {
    const { controller, service } = createController();

    await expect(
      controller.listByEdition('00000000-0000-4000-8000-000000000001', {}),
    ).resolves.toEqual([stored]);
    expect(service.listByEdition).toHaveBeenCalledWith('00000000-0000-4000-8000-000000000001', {});
  });

  it('gets one sub-event by id', async () => {
    const { controller } = createController();

    await expect(controller.get('00000000-0000-4000-8000-000000000004')).resolves.toEqual(stored);
  });

  it('creates a sub-event inside the edition of the url', async () => {
    const { controller, service } = createController();
    const input = {
      type: SubEventType.ECOPEDAL,
      name: 'Ecopedal',
      startDate: '2026-12-20',
      endDate: '2026-12-20',
    };

    await controller.create('00000000-0000-4000-8000-000000000001', input);

    expect(service.create).toHaveBeenCalledWith('00000000-0000-4000-8000-000000000001', input);
  });

  it('updates a sub-event', async () => {
    const { controller, service } = createController();

    await controller.update('00000000-0000-4000-8000-000000000004', { location: 'Praça' });

    expect(service.update).toHaveBeenCalledWith('00000000-0000-4000-8000-000000000004', {
      location: 'Praça',
    });
  });
});

describe('SubEventController access', () => {
  it.each(['listByEdition', 'get'] as const)('lets visitors call %s without login', (handler) => {
    expect(Reflect.getMetadata(IS_PUBLIC_KEY, SubEventController.prototype[handler])).toBe(true);
  });

  it.each(['create', 'update'] as const)('requires schedule management to call %s', (handler) => {
    expect(
      Reflect.getMetadata(REQUIRED_PERMISSIONS_KEY, SubEventController.prototype[handler]),
    ).toEqual([Permission.SCHEDULE_MANAGE]);
  });
});
