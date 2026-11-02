import type { RoleResponseDto } from '../dto/role-response.dto';
import type { RolePermission } from '../entities/role-permission.entity';
import type { Role } from '../entities/role.entity';

export function toRoleResponse(
  role: Role,
  rolePermissions: RolePermission[],
  userCount: number,
): RoleResponseDto {
  return {
    id: role.id,
    code: role.code,
    name: role.name,
    system: role.system,
    permissions: rolePermissions
      .filter((rolePermission) => rolePermission.roleId === role.id)
      .map((rolePermission) => rolePermission.permissionCode),
    userCount,
  };
}
