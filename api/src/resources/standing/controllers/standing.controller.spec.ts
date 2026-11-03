import { IS_PUBLIC_KEY } from '../../auth/decorators/decorators';
import { StandingController } from './standing.controller';

describe('StandingController', () => {
  it.each(['listByCategory', 'getByGroup', 'listSeeding'] as const)(
    'lets visitors call %s without login',
    (handler) => {
      expect(Reflect.getMetadata(IS_PUBLIC_KEY, StandingController.prototype[handler])).toBe(true);
    },
  );
});
