import { Injectable } from '@nestjs/common';
import { UserPermissionOverrideRepository } from '../../role/repository/user-permission-override.repository';
import type { Permission } from '../../role/enums/permission.enum';
import { removeOverride, setOverride } from '../rules/access-changes';
import type { AccessOverride } from '../rules/access-snapshot';
import { AccessPolicyService } from './access-policy.service';
import { UserService } from './user.service';

@Injectable()
export class UserPermissionService {
  public constructor(
    private readonly userService: UserService,
    private readonly overrideRepository: UserPermissionOverrideRepository,
    private readonly accessPolicy: AccessPolicyService,
  ) {}

  public async setOverride(actorId: string, override: AccessOverride): Promise<void> {
    this.accessPolicy.assertNotSelf(actorId, override.userId);
    await this.userService.findByIdOrFail(override.userId);
    await this.accessPolicy.assertPermissionsManagerRemains(setOverride(override));
    await this.overrideRepository.save(override.userId, override.permission, override.effect);
  }

  public async removeOverride(
    actorId: string,
    targetId: string,
    permission: Permission,
  ): Promise<void> {
    this.accessPolicy.assertNotSelf(actorId, targetId);
    await this.userService.findByIdOrFail(targetId);
    await this.accessPolicy.assertPermissionsManagerRemains(removeOverride(targetId, permission));
    await this.overrideRepository.remove(targetId, permission);
  }
}
