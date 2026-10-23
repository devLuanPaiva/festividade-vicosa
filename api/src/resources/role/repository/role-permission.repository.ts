import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  public async findPermissionsByRoleId(roleId: number): Promise<Permission[]> {
    const rolePermissions = await this.repository.findBy({ roleId });
    return rolePermissions.map((rolePermission) => rolePermission.permissionCode);
  }
}
