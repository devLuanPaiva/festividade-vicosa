import { Permission } from '../../role/enums/permission.enum';
import { IS_PUBLIC_KEY, Public, REQUIRED_PERMISSIONS_KEY, RequirePermission } from './decorators';

describe('Public', () => {
  it('marks the handler as public', () => {
    class Sample {
      @Public()
      public handler(): string {
        return 'handled';
      }
    }

    expect(Reflect.getMetadata(IS_PUBLIC_KEY, Sample.prototype.handler)).toBe(true);
  });
});

describe('RequirePermission', () => {
  it('stores the required permissions on the handler', () => {
    class Sample {
      @RequirePermission(Permission.PHOTO_UPLOAD, Permission.PHOTO_DELETE)
      public handler(): string {
        return 'handled';
      }
    }

    expect(Reflect.getMetadata(REQUIRED_PERMISSIONS_KEY, Sample.prototype.handler)).toEqual([
      Permission.PHOTO_UPLOAD,
      Permission.PHOTO_DELETE,
    ]);
  });
});
