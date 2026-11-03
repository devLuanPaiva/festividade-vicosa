import type { UserResponseDto } from '../dto/user-response.dto';
import type { UserWithRoles } from '../rules/user-roles';

export function toUserResponse({ user, userRoles }: UserWithRoles): UserResponseDto {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    active: user.active,
    roles: userRoles.map((userRole) => ({
      id: userRole.roleId,
      name: userRole.role.name,
      primary: userRole.isPrimary,
    })),
    createdAt: user.createdAt,
  };
}
