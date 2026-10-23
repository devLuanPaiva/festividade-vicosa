import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { RolePermissionRepository } from '../../role/repository/role-permission.repository';
import { UserPermissionOverrideRepository } from '../../role/repository/user-permission-override.repository';
import { UserRepository } from '../repository/user.repository';
import type { AccessChange } from '../rules/access-changes';
import type { AccessSnapshot } from '../rules/access-snapshot';
import { countPermissionsManagers } from '../rules/permissions-manager.rule';

@Injectable()
export class AccessPolicyService {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly rolePermissionRepository: RolePermissionRepository,
    private readonly overrideRepository: UserPermissionOverrideRepository,
  ) {}

  public assertNotSelf(actorId: number, targetId: number): void {
    if (actorId === targetId) {
      throw new ForbiddenException('You cannot change your own permissions');
    }
  }

  public async assertPermissionsManagerRemains(change: AccessChange): Promise<void> {
    const before = await this.loadSnapshot();
    const managersAfter = countPermissionsManagers(change(before));

    if (countPermissionsManagers(before) > 0 && managersAfter === 0) {
      throw new ConflictException('At least one active user must keep the permissions management');
    }
  }

  private async loadSnapshot(): Promise<AccessSnapshot> {
    const [users, rolePermissions, overrides] = await Promise.all([
      this.userRepository.findAccessUsers(),
      this.rolePermissionRepository.findAll(),
      this.overrideRepository.findAll(),
    ]);

    return {
      users,
      rolePermissions: rolePermissions.map(({ roleId, permissionCode }) => ({
        roleId,
        permission: permissionCode,
      })),
      overrides: overrides.map(({ userId, permissionCode, effect }) => ({
        userId,
        permission: permissionCode,
        effect,
      })),
    };
  }
}
