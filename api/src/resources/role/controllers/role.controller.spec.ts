import { REQUIRED_PERMISSIONS_KEY } from '../../auth/decorators/decorators';
import { Permission } from '../enums/permission.enum';
import type { RoleService } from '../services/role.service';
import { RoleController } from './role.controller';

describe('RoleController', () => {
  it('lists the roles through the role service', async () => {
    const roles = [{ code: 'ADMIN', name: 'Administrator', permissions: [] }];
    const controller = new RoleController({
      list: jest.fn().mockResolvedValue(roles),
    } as unknown as RoleService);

    await expect(controller.list()).resolves.toBe(roles);
  });

  it('requires the permission to manage users', () => {
    expect(Reflect.getMetadata(REQUIRED_PERMISSIONS_KEY, RoleController.prototype.list)).toEqual([
      Permission.USER_MANAGE,
    ]);
  });
});
