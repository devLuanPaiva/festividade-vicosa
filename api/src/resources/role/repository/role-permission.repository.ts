import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { RolePermission } from '../entities/role-permission.entity';
import type { Permission } from '../enums/permission.enum';

@Injectable()
export class RolePermissionRepository {
  public constructor(
    @InjectRepository(RolePermission) private readonly repository: Repository<RolePermission>,
  ) {}

  public findAll(): Promise<RolePermission[]> {
    return this.repository.find();
  }

  public async findPermissionsByRoleIds(roleIds: string[]): Promise<Permission[]> {
    const rolePermissions = await this.repository.findBy({ roleId: In(roleIds) });
    return rolePermissions.map((rolePermission) => rolePermission.permissionCode);
  }

  public replace(roleId: string, permissions: Permission[]): Promise<void> {
    return this.repository.manager.transaction(async (manager) => {
      await manager.delete(RolePermission, { roleId });
      await manager.insert(
        RolePermission,
        permissions.map((permissionCode) => ({ roleId, permissionCode })),
      );
    });
  }
}
