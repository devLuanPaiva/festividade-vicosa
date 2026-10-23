import { Injectable } from '@nestjs/common';
import type { Permission } from '../enums/permission.enum';
import { RolePermissionRepository } from '../repository/role-permission.repository';
import { UserPermissionOverrideRepository } from '../repository/user-permission-override.repository';
import { resolveEffectivePermissions } from '../rules/resolve-effective-permissions';

export interface PermissionSubject {
  id: number;
  roleId: number;
}

@Injectable()
export class AccessControlService {
  public constructor(
    private readonly rolePermissionRepository: RolePermissionRepository,
    private readonly overrideRepository: UserPermissionOverrideRepository,
  ) {}

  public async getEffectivePermissions(subject: PermissionSubject): Promise<Permission[]> {
    const [rolePermissions, overrides] = await Promise.all([
      this.rolePermissionRepository.findPermissionsByRoleId(subject.roleId),
      this.overrideRepository.findByUserId(subject.id),
    ]);

    return resolveEffectivePermissions(rolePermissions, overrides);
  }
}
