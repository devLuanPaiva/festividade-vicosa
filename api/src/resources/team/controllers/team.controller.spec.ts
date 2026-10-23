import { IS_PUBLIC_KEY, REQUIRED_PERMISSIONS_KEY } from '../../auth/decorators/decorators';
import { Permission } from '../../role/enums/permission.enum';
import type { TeamService } from '../services/team.service';
import { TeamController } from './team.controller';

const stored = { id: 7, categoryId: 5, groupId: null, name: 'Centro' };

function createController(): {
  controller: TeamController;
  service: Record<'listByCategory' | 'findByIdOrFail' | 'create' | 'update' | 'remove', jest.Mock>;
} {
  const service = {
    listByCategory: jest.fn().mockResolvedValue([stored]),
    findByIdOrFail: jest.fn().mockResolvedValue(stored),
    create: jest.fn().mockResolvedValue(stored),
    update: jest.fn().mockResolvedValue(stored),
    remove: jest.fn().mockResolvedValue(undefined),
  };
  return { controller: new TeamController(service as unknown as TeamService), service };
}

describe('TeamController', () => {
  it('lists the teams of a category as response dtos', async () => {
    const { controller, service } = createController();

    await expect(controller.listByCategory(5)).resolves.toEqual([stored]);
    expect(service.listByCategory).toHaveBeenCalledWith(5);
  });

  it('gets one team by id', async () => {
    const { controller } = createController();

    await expect(controller.get(7)).resolves.toEqual(stored);
  });

  it('creates a team inside the category of the url', async () => {
    const { controller, service } = createController();

    await controller.create(5, { name: 'Centro', groupId: 1 });

    expect(service.create).toHaveBeenCalledWith(5, { name: 'Centro', groupId: 1 });
  });

  it('updates a team', async () => {
    const { controller, service } = createController();

    await controller.update(7, { groupId: null });

    expect(service.update).toHaveBeenCalledWith(7, { groupId: null });
  });

  it('removes a team', async () => {
    const { controller, service } = createController();

    await controller.remove(7);

    expect(service.remove).toHaveBeenCalledWith(7);
  });
});

describe('TeamController access', () => {
  it.each(['listByCategory', 'get'] as const)('lets visitors call %s without login', (handler) => {
    expect(Reflect.getMetadata(IS_PUBLIC_KEY, TeamController.prototype[handler])).toBe(true);
  });

  it.each(['create', 'update', 'remove'] as const)(
    'requires team management to call %s',
    (handler) => {
      expect(
        Reflect.getMetadata(REQUIRED_PERMISSIONS_KEY, TeamController.prototype[handler]),
      ).toEqual([Permission.TEAM_MANAGE]);
    },
  );
});
