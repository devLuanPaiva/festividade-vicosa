import type { ConfigService } from '@nestjs/config';
import { RoleCode } from '../../role/enums/role-code.enum';
import type { EnvironmentVariables } from '../../../config/environment';
import { AdminBootstrapService } from './admin-bootstrap.service';
import type { UserService } from './user.service';

function createService(
  userCount: number,
  settings: Partial<Record<'ADMIN_EMAIL' | 'ADMIN_INITIAL_PASSWORD', string>>,
): { service: AdminBootstrapService; createWithRole: jest.Mock } {
  const createWithRole = jest.fn().mockResolvedValue({});
  const usersService = { count: jest.fn().mockResolvedValue(userCount), createWithRole };
  const config = { get: jest.fn((key: keyof typeof settings) => settings[key]) };
  const service = new AdminBootstrapService(
    config as unknown as ConfigService<EnvironmentVariables, true>,
    usersService as unknown as UserService,
  );
  return { service, createWithRole };
}

const credentials = { ADMIN_EMAIL: 'admin@example.com', ADMIN_INITIAL_PASSWORD: 'a-long-password' };

describe('AdminBootstrapService', () => {
  it('creates the initial administrator when no user exists', async () => {
    const { service, createWithRole } = createService(0, credentials);

    await service.onApplicationBootstrap();

    expect(createWithRole).toHaveBeenCalledWith(RoleCode.ADMIN, {
      name: 'Administrator',
      email: 'admin@example.com',
      password: 'a-long-password',
    });
  });

  it('does nothing when users already exist', async () => {
    const { service, createWithRole } = createService(1, credentials);

    await service.onApplicationBootstrap();

    expect(createWithRole).not.toHaveBeenCalled();
  });

  it.each([
    { scenario: 'the email is missing', settings: { ADMIN_INITIAL_PASSWORD: 'a-long-password' } },
    { scenario: 'the password is missing', settings: { ADMIN_EMAIL: 'admin@example.com' } },
    { scenario: 'both are missing', settings: {} },
  ])('does not create a user when $scenario', async ({ settings }) => {
    const { service, createWithRole } = createService(0, settings);

    await service.onApplicationBootstrap();

    expect(createWithRole).not.toHaveBeenCalled();
  });
});
