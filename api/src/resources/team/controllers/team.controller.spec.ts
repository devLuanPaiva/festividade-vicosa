import { IS_PUBLIC_KEY, REQUIRED_PERMISSIONS_KEY } from '../../auth/decorators/decorators';
import { Permission } from '../../role/enums/permission.enum';
import type { TeamService } from '../services/team.service';
import { TeamController } from './team.controller';

const TEAM_ID = '00000000-0000-4000-8000-000000000007';
const CATEGORY_ID = '00000000-0000-4000-8000-000000000005';
const GROUP_ID = '00000000-0000-4000-8000-000000000001';

const stored = {
  id: TEAM_ID,
  categoryId: CATEGORY_ID,
  groupId: null,
  name: 'Centro',
  slug: 'centro',
  city: 'Viçosa',
  abbreviation: null,
  photoKey: null,
};

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
  it('lists the teams of a category as response dtos passing the filters on', async () => {
    const { controller, service } = createController();
    const filters = { city: 'Viçosa', groupId: GROUP_ID };

    await expect(controller.listByCategory(CATEGORY_ID, filters)).resolves.toEqual([stored]);
    expect(service.listByCategory).toHaveBeenCalledWith(CATEGORY_ID, filters);
  });

  it('gets one team by id', async () => {
    const { controller } = createController();

    await expect(controller.get(TEAM_ID)).resolves.toEqual(stored);
  });

  it('creates a team inside the category of the url', async () => {
    const { controller, service } = createController();
    const input = { name: 'Centro', city: 'Viçosa', groupId: GROUP_ID };

    await controller.create(CATEGORY_ID, input);

    expect(service.create).toHaveBeenCalledWith(CATEGORY_ID, input);
  });

  it('updates a team', async () => {
    const { controller, service } = createController();

    await controller.update(TEAM_ID, { groupId: null });

    expect(service.update).toHaveBeenCalledWith(TEAM_ID, { groupId: null });
  });

  it('removes a team', async () => {
    const { controller, service } = createController();

    await controller.remove(TEAM_ID);

    expect(service.remove).toHaveBeenCalledWith(TEAM_ID);
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
