import { IS_PUBLIC_KEY } from '../../auth/decorators/decorators';
import type { StandingService } from '../services/standing.service';
import { StandingController } from './standing.controller';

const ID = '00000000-0000-4000-8000-000000000005';

function createController(): {
  controller: StandingController;
  service: Record<'listByCategory' | 'getByGroup' | 'listSeeding', jest.Mock>;
} {
  const service = {
    listByCategory: jest.fn().mockResolvedValue([{ groupName: 'Grupo A', rows: [] }]),
    getByGroup: jest.fn().mockResolvedValue([{ teamName: 'Alfa' }]),
    listSeeding: jest.fn().mockResolvedValue([{ seed: 1, teamName: 'Alfa' }]),
  };
  return { controller: new StandingController(service as unknown as StandingService), service };
}

describe('StandingController', () => {
  it('delegates the category standings to the service', async () => {
    const { controller, service } = createController();

    await expect(controller.listByCategory(ID)).resolves.toEqual([
      { groupName: 'Grupo A', rows: [] },
    ]);
    expect(service.listByCategory).toHaveBeenCalledWith(ID);
  });

  it('delegates the group standings to the service', async () => {
    const { controller, service } = createController();

    await expect(controller.getByGroup(ID)).resolves.toEqual([{ teamName: 'Alfa' }]);
    expect(service.getByGroup).toHaveBeenCalledWith(ID);
  });

  it('delegates the seeding to the service', async () => {
    const { controller, service } = createController();

    await expect(controller.listSeeding(ID)).resolves.toEqual([{ seed: 1, teamName: 'Alfa' }]);
    expect(service.listSeeding).toHaveBeenCalledWith(ID);
  });

  it.each(['listByCategory', 'getByGroup', 'listSeeding'] as const)(
    'lets visitors call %s without login',
    (handler) => {
      expect(Reflect.getMetadata(IS_PUBLIC_KEY, StandingController.prototype[handler])).toBe(true);
    },
  );
});
