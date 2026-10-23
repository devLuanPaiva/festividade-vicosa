import type { PermissionEffect } from '../../role/enums/permission-effect.enum';
import type { Permission } from '../../role/enums/permission.enum';

export interface AccessUser {
  id: number;
  active: boolean;
  roleId: number;
}

export interface AccessRolePermission {
  roleId: number;
  permission: Permission;
}

export interface AccessOverride {
  userId: number;
  permission: Permission;
  effect: PermissionEffect;
}

export interface AccessSnapshot {
  users: AccessUser[];
  rolePermissions: AccessRolePermission[];
  overrides: AccessOverride[];
}
