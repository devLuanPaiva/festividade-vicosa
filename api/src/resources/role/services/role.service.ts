import { Injectable } from '@nestjs/common';
import type { RoleResponseDto } from '../dto/role-response.dto';
import type { RolePermission } from '../entities/role-permission.entity';
import { RolePermissionRepository } from '../repository/role-permission.repository';
import { RoleRepository } from '../repository/role.repository';

@Injectable()
export class RoleService {
  public constructor(
    private readonly roleRepository: RoleRepository,
    private readonly rolePermissionRepository: RolePermissionRepository,
  ) {}

  public async list(): Promise<RoleResponseDto[]> {
    const [roles, rolePermissions] = await Promise.all([
      this.roleRepository.findAll(),
      this.rolePermissionRepository.findAll(),
    ]);

    return roles.map((role) => ({
      code: role.code,
      name: role.name,
      permissions: this.permissionsOfRole(rolePermissions, role.id),
    }));
  }

  private permissionsOfRole(
    rolePermissions: RolePermission[],
    roleId: number,
  ): RoleResponseDto['permissions'] {
    return rolePermissions
      .filter((rolePermission) => rolePermission.roleId === roleId)
      .map((rolePermission) => rolePermission.permissionCode);
  }
}
