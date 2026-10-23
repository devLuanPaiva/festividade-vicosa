import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPermissionOverride } from '../entities/user-permission-override.entity';
import type { PermissionOverride } from '../rules/resolve-effective-permissions';

@Injectable()
export class UserPermissionOverrideRepository {
  public constructor(
    @InjectRepository(UserPermissionOverride)
    private readonly repository: Repository<UserPermissionOverride>,
  ) {}

  public async findByUserId(userId: number): Promise<PermissionOverride[]> {
    const overrides = await this.repository.findBy({ userId });
    return overrides.map(({ permissionCode, effect }) => ({ permission: permissionCode, effect }));
  }
}
