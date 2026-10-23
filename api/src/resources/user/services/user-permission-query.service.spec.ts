import { NotFoundException } from '@nestjs/common';
import { PermissionEffect } from '../../role/enums/permission-effect.enum';
import { Permission } from '../../role/enums/permission.enum';
import type { AccessControlService } from '../../role/services/access-control.service';
import { UserPermissionQueryService } from './user-permission-query.service';
import type { UserService } from './user.service';

describe('UserPermissionQueryService', () => {
  it('describes the effective permissions and overrides of the user', async () => {
    const access = {
      permissions: [Permission.PHOTO_UPLOAD],
      overrides: [{ permission: Permission.PHOTO_UPLOAD, effect: PermissionEffect.GRANTED }],
    };
    const describeAccess = jest.fn().mockResolvedValue(access);
    const service = new UserPermissionQueryService(
      {
        findByIdOrFail: jest.fn().mockResolvedValue({ id: 7, roleId: 3 }),
      } as unknown as UserService,
      { describeAccess } as unknown as AccessControlService,
    );

    await expect(service.getPermissions(7)).resolves.toBe(access);
    expect(describeAccess).toHaveBeenCalledWith({ id: 7, roleId: 3 });
  });

  it('fails when the user does not exist', async () => {
    const service = new UserPermissionQueryService(
      {
        findByIdOrFail: jest.fn().mockRejectedValue(new NotFoundException()),
      } as unknown as UserService,
      {} as unknown as AccessControlService,
    );

    await expect(service.getPermissions(99)).rejects.toBeInstanceOf(NotFoundException);
  });
});
