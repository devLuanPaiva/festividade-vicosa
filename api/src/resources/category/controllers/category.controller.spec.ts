import { IS_PUBLIC_KEY, REQUIRED_PERMISSIONS_KEY } from '../../auth/decorators/decorators';
import { Permission } from '../../role/enums/permission.enum';
import { CategoryController } from './category.controller';

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
