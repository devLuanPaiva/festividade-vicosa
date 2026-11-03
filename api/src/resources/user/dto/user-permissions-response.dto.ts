import type { Permission } from '../../role/enums/permission.enum';
import type { PermissionOverride } from '../../role/rules/resolve-effective-permissions';

export interface UserPermissionsResponseDto {
  permissions: Permission[];
  overrides: PermissionOverride[];
}
