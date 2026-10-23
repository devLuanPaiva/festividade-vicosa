import { IS_PUBLIC_KEY, REQUIRED_PERMISSIONS_KEY } from '../../auth/decorators/decorators';
import { Permission } from '../../role/enums/permission.enum';
import type { Edition } from '../entities/edition.entity';
import type { EditionService } from '../services/edition.service';
import { EditionController } from './edition.controller';

const publicEdition = { id: 1, year: 2026, name: 'Festividade 2026', description: null };
const stored = publicEdition as Edition;

function createController(): {
  controller: EditionController;
  service: Record<'list' | 'findByIdOrFail' | 'create' | 'update', jest.Mock>;
} {
  const service = {
    list: jest.fn().mockResolvedValue([stored]),
    findByIdOrFail: jest.fn().mockResolvedValue(stored),
    create: jest.fn().mockResolvedValue(stored),
    update: jest.fn().mockResolvedValue(stored),
  };
  return { controller: new EditionController(service as unknown as EditionService), service };
}

describe('EditionController', () => {
  it('lists the editions as response dtos', async () => {
    const { controller } = createController();

    await expect(controller.list()).resolves.toEqual([publicEdition]);
  });

  it('gets one edition by id', async () => {
    const { controller, service } = createController();

    await expect(controller.get(1)).resolves.toEqual(publicEdition);
    expect(service.findByIdOrFail).toHaveBeenCalledWith(1);
  });

  it('creates an edition', async () => {
    const { controller, service } = createController();
    const input = { year: 2026, name: 'Festividade 2026' };

    await controller.create(input);

    expect(service.create).toHaveBeenCalledWith(input);
  });

  it('updates an edition', async () => {
    const { controller, service } = createController();

    await controller.update(1, { name: 'Novo nome' });

    expect(service.update).toHaveBeenCalledWith(1, { name: 'Novo nome' });
  });
});

describe('EditionController access', () => {
  it.each(['list', 'get'] as const)('lets visitors call %s without login', (handler) => {
    expect(Reflect.getMetadata(IS_PUBLIC_KEY, EditionController.prototype[handler])).toBe(true);
  });

  it.each(['create', 'update'] as const)('requires schedule management to call %s', (handler) => {
    expect(
      Reflect.getMetadata(REQUIRED_PERMISSIONS_KEY, EditionController.prototype[handler]),
    ).toEqual([Permission.SCHEDULE_MANAGE]);
  });
});
