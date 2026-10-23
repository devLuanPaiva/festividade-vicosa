import { IS_PUBLIC_KEY, REQUIRED_PERMISSIONS_KEY } from '../../auth/decorators/decorators';
import { Permission } from '../../role/enums/permission.enum';
import type { MatchGroupService } from '../services/match-group.service';
import { MatchGroupController } from './match-group.controller';

const stored = {
  id: '00000000-0000-4000-8000-000000000001',
  categoryId: '00000000-0000-4000-8000-000000000005',
  name: 'Grupo A',
};

function createController(): {
  controller: MatchGroupController;
  service: Record<'listByCategory' | 'findByIdOrFail' | 'create' | 'update' | 'remove', jest.Mock>;
} {
  const service = {
    listByCategory: jest.fn().mockResolvedValue([stored]),
    findByIdOrFail: jest.fn().mockResolvedValue(stored),
    create: jest.fn().mockResolvedValue(stored),
    update: jest.fn().mockResolvedValue(stored),
    remove: jest.fn().mockResolvedValue(undefined),
  };
  return {
    controller: new MatchGroupController(service as unknown as MatchGroupService),
    service,
  };
}

describe('MatchGroupController', () => {
  it('lists the groups of a category as response dtos', async () => {
    const { controller, service } = createController();

    await expect(
      controller.listByCategory('00000000-0000-4000-8000-000000000005', {}),
    ).resolves.toEqual([stored]);
    expect(service.listByCategory).toHaveBeenCalledWith('00000000-0000-4000-8000-000000000005', {});
  });

  it('gets one group by id', async () => {
    const { controller } = createController();

    await expect(controller.get('00000000-0000-4000-8000-000000000001')).resolves.toEqual(stored);
  });

  it('creates a group inside the category of the url', async () => {
    const { controller, service } = createController();

    await controller.create('00000000-0000-4000-8000-000000000005', { name: 'Grupo A' });

    expect(service.create).toHaveBeenCalledWith('00000000-0000-4000-8000-000000000005', {
      name: 'Grupo A',
    });
  });

  it('renames a group', async () => {
    const { controller, service } = createController();

    await controller.update('00000000-0000-4000-8000-000000000001', { name: 'Grupo B' });

    expect(service.update).toHaveBeenCalledWith('00000000-0000-4000-8000-000000000001', {
      name: 'Grupo B',
    });
  });

  it('removes a group', async () => {
    const { controller, service } = createController();

    await controller.remove('00000000-0000-4000-8000-000000000001');

    expect(service.remove).toHaveBeenCalledWith('00000000-0000-4000-8000-000000000001');
  });
});

describe('MatchGroupController access', () => {
  it.each(['listByCategory', 'get'] as const)('lets visitors call %s without login', (handler) => {
    expect(Reflect.getMetadata(IS_PUBLIC_KEY, MatchGroupController.prototype[handler])).toBe(true);
  });

  it.each(['create', 'update', 'remove'] as const)(
    'requires team management to call %s',
    (handler) => {
      expect(
        Reflect.getMetadata(REQUIRED_PERMISSIONS_KEY, MatchGroupController.prototype[handler]),
      ).toEqual([Permission.TEAM_MANAGE]);
    },
  );
});
