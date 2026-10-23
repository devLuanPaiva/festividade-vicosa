import { IS_PUBLIC_KEY, REQUIRED_PERMISSIONS_KEY } from '../../auth/decorators/decorators';
import { Permission } from '../../role/enums/permission.enum';
import type { Category } from '../entities/category.entity';
import { Gender } from '../enums/gender.enum';
import type { CategoryService } from '../services/category.service';
import { CategoryController } from './category.controller';

const stored: Category = {
  id: 5,
  subEventId: 2,
  name: 'Adulto',
  gender: Gender.MALE,
  ageRange: null,
};

function createController(): {
  controller: CategoryController;
  service: Record<'listBySubEvent' | 'findByIdOrFail' | 'create' | 'update', jest.Mock>;
} {
  const service = {
    listBySubEvent: jest.fn().mockResolvedValue([stored]),
    findByIdOrFail: jest.fn().mockResolvedValue(stored),
    create: jest.fn().mockResolvedValue(stored),
    update: jest.fn().mockResolvedValue(stored),
  };
  return { controller: new CategoryController(service as unknown as CategoryService), service };
}

describe('CategoryController', () => {
  it('lists the categories of a sub-event as response dtos', async () => {
    const { controller, service } = createController();

    await expect(controller.listBySubEvent(2)).resolves.toEqual([stored]);
    expect(service.listBySubEvent).toHaveBeenCalledWith(2);
  });

  it('gets one category by id', async () => {
    const { controller } = createController();

    await expect(controller.get(5)).resolves.toEqual(stored);
  });

  it('creates a category inside the sub-event of the url', async () => {
    const { controller, service } = createController();
    const input = { name: 'Adulto', gender: Gender.MALE };

    await controller.create(2, input);

    expect(service.create).toHaveBeenCalledWith(2, input);
  });

  it('updates a category', async () => {
    const { controller, service } = createController();

    await controller.update(5, { name: 'Principal' });

    expect(service.update).toHaveBeenCalledWith(5, { name: 'Principal' });
  });
});

describe('CategoryController access', () => {
  it.each(['listBySubEvent', 'get'] as const)('lets visitors call %s without login', (handler) => {
    expect(Reflect.getMetadata(IS_PUBLIC_KEY, CategoryController.prototype[handler])).toBe(true);
  });

  it.each(['create', 'update'] as const)('requires team management to call %s', (handler) => {
    expect(
      Reflect.getMetadata(REQUIRED_PERMISSIONS_KEY, CategoryController.prototype[handler]),
    ).toEqual([Permission.TEAM_MANAGE]);
  });
});
