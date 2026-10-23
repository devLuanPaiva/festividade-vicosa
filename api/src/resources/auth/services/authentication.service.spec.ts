import { UnauthorizedException } from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';
import type { AccessControlService } from '../../role/services/access-control.service';
import { Permission } from '../../role/enums/permission.enum';
import type { User } from '../../user/entities/user.entity';
import type { UserService } from '../../user/services/user.service';
import { AuthenticationService } from './authentication.service';

const user = { id: 9, name: 'Ana', email: 'ana@example.com', roleId: 3 } as User;

interface FixtureOptions {
  verify: jest.Mock;
  foundUser: User | null;
}

function createService({ verify, foundUser }: FixtureOptions): AuthenticationService {
  return new AuthenticationService(
    { verifyAsync: verify } as unknown as JwtService,
    { findActiveById: jest.fn().mockResolvedValue(foundUser) } as unknown as UserService,
    {
      getEffectivePermissions: jest.fn().mockResolvedValue([Permission.PHOTO_UPLOAD]),
    } as unknown as AccessControlService,
  );
}

describe('AuthenticationService', () => {
  it('returns the user with the effective permissions for a valid token', async () => {
    const service = createService({
      verify: jest.fn().mockResolvedValue({ sub: 9 }),
      foundUser: user,
    });

    await expect(service.authenticate('valid.token')).resolves.toEqual({
      id: 9,
      name: 'Ana',
      email: 'ana@example.com',
      permissions: [Permission.PHOTO_UPLOAD],
    });
  });

  it('rejects an invalid or expired token', async () => {
    const service = createService({
      verify: jest.fn().mockRejectedValue(new Error('jwt expired')),
      foundUser: user,
    });

    await expect(service.authenticate('expired.token')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('rejects a token of a user that is inactive or was removed', async () => {
    const service = createService({
      verify: jest.fn().mockResolvedValue({ sub: 9 }),
      foundUser: null,
    });

    await expect(service.authenticate('valid.token')).rejects.toMatchObject({
      response: { code: 'USER_INACTIVE' },
    });
  });
});
