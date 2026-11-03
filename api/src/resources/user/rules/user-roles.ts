import type { UserRole } from '../../role/entities/user-role.entity';
import type { RoleAssignment } from '../../role/repository/user-role.repository';
import type { User } from '../entities/user.entity';

export interface UserWithRoles {
  user: User;
  userRoles: UserRole[];
}

export function attachRoles(users: User[], userRoles: UserRole[]): UserWithRoles[] {
  return users.map((user) => ({
    user,
    userRoles: userRoles.filter((userRole) => userRole.userId === user.id),
  }));
}

export function toRoleAssignments(roleIds: string[], primaryRoleId: string): RoleAssignment[] {
  return roleIds.map((roleId) => ({ roleId, isPrimary: roleId === primaryRoleId }));
}
