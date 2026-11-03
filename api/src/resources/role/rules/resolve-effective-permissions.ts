import { PermissionEffect } from '../enums/permission-effect.enum';
import type { Permission } from '../enums/permission.enum';

export interface PermissionOverride {
  permission: Permission;
  effect: PermissionEffect;
}

function permissionsWithEffect(
  overrides: readonly PermissionOverride[],
  effect: PermissionEffect,
): Permission[] {
  return overrides
    .filter((override) => override.effect === effect)
    .map((override) => override.permission);
}

export function resolveEffectivePermissions(
  rolePermissions: readonly Permission[],
  overrides: readonly PermissionOverride[],
): Permission[] {
  const granted = permissionsWithEffect(overrides, PermissionEffect.GRANTED);
  const revoked = new Set(permissionsWithEffect(overrides, PermissionEffect.REVOKED));
  const candidates = new Set([...rolePermissions, ...granted]);

  return [...candidates].filter((permission) => !revoked.has(permission));
}
