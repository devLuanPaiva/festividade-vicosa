import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPermissionOverride } from '../entities/user-permission-override.entity';
import type { PermissionEffect } from '../enums/permission-effect.enum';
import type { Permission } from '../enums/permission.enum';
import type { PermissionOverride } from '../rules/resolve-effective-permissions';

@Injectable()
export class UserPermissionOverrideRepository {
  public constructor(
    @InjectRepository(UserPermissionOverride)
    private readonly repository: Repository<UserPermissionOverride>,
  ) {}

  public findAll(): Promise<UserPermissionOverride[]> {
    return this.repository.find();
  }

  public async findByUserId(userId: number): Promise<PermissionOverride[]> {
    const overrides = await this.repository.findBy({ userId });
    return overrides.map(({ permissionCode, effect }) => ({ permission: permissionCode, effect }));
  }

  public save(userId: number, permission: Permission, effect: PermissionEffect): Promise<unknown> {
    return this.repository.save({ userId, permissionCode: permission, effect });
  }

  public remove(userId: number, permission: Permission): Promise<unknown> {
    return this.repository.delete({ userId, permissionCode: permission });
  }
}
