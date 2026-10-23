import { IS_PUBLIC_KEY, REQUIRED_PERMISSIONS_KEY } from '../../auth/decorators/decorators';
import { Permission } from '../../role/enums/permission.enum';
import { SubEventController } from './sub-event.controller';

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
