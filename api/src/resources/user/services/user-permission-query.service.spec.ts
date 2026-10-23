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
        findByIdOrFail: jest.fn().mockResolvedValue({
          id: '00000000-0000-4000-8000-000000000007',
          roleId: '00000000-0000-4000-8000-000000000003',
        }),
      } as unknown as UserService,
      { describeAccess } as unknown as AccessControlService,
    );

    await expect(service.getPermissions('00000000-0000-4000-8000-000000000007')).resolves.toBe(
      access,
    );
    expect(describeAccess).toHaveBeenCalledWith({
      id: '00000000-0000-4000-8000-000000000007',
      roleId: '00000000-0000-4000-8000-000000000003',
    });
  });

  it('fails when the user does not exist', async () => {
    const service = new UserPermissionQueryService(
      {
        findByIdOrFail: jest.fn().mockRejectedValue(new NotFoundException()),
      } as unknown as UserService,
      {} as unknown as AccessControlService,
    );

    await expect(
      service.getPermissions('00000000-0000-4000-8000-000000000099'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
