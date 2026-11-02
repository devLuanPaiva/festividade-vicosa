import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { RolePermission } from '../../role/entities/role-permission.entity';
import { UserPermissionOverride } from '../../role/entities/user-permission-override.entity';
import { UserRole } from '../../role/entities/user-role.entity';
import { User } from '../../user/entities/user.entity';
import type { AccessSnapshot, AccessUser } from '../rules/access-snapshot';

function toAccessUsers(users: User[], userRoles: UserRole[]): AccessUser[] {
  return users.map(({ id, active }) => ({
    id,
    active,
    roleIds: userRoles.filter((userRole) => userRole.userId === id).map(({ roleId }) => roleId),
  }));
}

@Injectable()
export class AccessSnapshotRepository {
  public constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

  public async load(): Promise<AccessSnapshot> {
    const [users, userRoles, rolePermissions, overrides] = await Promise.all([
      this.manager.find(User, { select: { id: true, active: true } }),
      this.manager.find(UserRole),
      this.manager.find(RolePermission),
      this.manager.find(UserPermissionOverride),
    ]);

    return {
      users: toAccessUsers(users, userRoles),
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
