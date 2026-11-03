import { IS_PUBLIC_KEY, REQUIRED_PERMISSIONS_KEY } from '../../auth/decorators/decorators';
import { Permission } from '../../role/enums/permission.enum';
import { EditionController } from './edition.controller';

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
