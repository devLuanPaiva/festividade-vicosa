import type { PermissionEffect } from '../../role/enums/permission-effect.enum';
import type { Permission } from '../../role/enums/permission.enum';

export interface AccessUser {
  id: string;
  active: boolean;
  roleId: string;
}

export interface AccessRolePermission {
  roleId: string;
  permission: Permission;
}

export interface AccessOverride {
  userId: string;
  permission: Permission;
  effect: PermissionEffect;
}

export interface AccessSnapshot {
  users: AccessUser[];
  rolePermissions: AccessRolePermission[];
  overrides: AccessOverride[];
}
