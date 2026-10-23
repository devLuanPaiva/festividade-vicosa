import { Injectable } from '@nestjs/common';
import type { Permission } from '../enums/permission.enum';
import { RolePermissionRepository } from '../repository/role-permission.repository';
import { UserPermissionOverrideRepository } from '../repository/user-permission-override.repository';
import {
  resolveEffectivePermissions,
  type PermissionOverride,
} from '../rules/resolve-effective-permissions';

export interface PermissionSubject {
  id: string;
  roleId: string;
}

export interface AccessDescription {
  permissions: Permission[];
  overrides: PermissionOverride[];
}

@Injectable()
export class AccessControlService {
  public constructor(
    private readonly rolePermissionRepository: RolePermissionRepository,
    private readonly overrideRepository: UserPermissionOverrideRepository,
  ) {}

  public async describeAccess(subject: PermissionSubject): Promise<AccessDescription> {
    const [rolePermissions, overrides] = await Promise.all([
      this.rolePermissionRepository.findPermissionsByRoleId(subject.roleId),
      this.overrideRepository.findByUserId(subject.id),
    ]);

    return { permissions: resolveEffectivePermissions(rolePermissions, overrides), overrides };
  }

  public async getEffectivePermissions(subject: PermissionSubject): Promise<Permission[]> {
    const { permissions } = await this.describeAccess(subject);
    return permissions;
  }
}
