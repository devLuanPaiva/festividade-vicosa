import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { escapeLikeText } from '../../../common/database/text-search';
import { RolePermission } from '../entities/role-permission.entity';
import { Role } from '../entities/role.entity';
import type { Permission } from '../enums/permission.enum';
import type { RoleCode } from '../enums/role-code.enum';

export interface NewRoleRecord {
  code: string;
  name: string;
  permissions: Permission[];
}

@Injectable()
export class RoleRepository {
  public constructor(@InjectRepository(Role) private readonly repository: Repository<Role>) {}

  public findAll(): Promise<Role[]> {
    return this.repository.find({ order: { name: 'ASC', id: 'ASC' } });
  }

  public findById(id: string): Promise<Role | null> {
    return this.repository.findOneBy({ id });
  }

  public findByIds(ids: string[]): Promise<Role[]> {
    return this.repository.findBy({ id: In(ids) });
  }

  public findByCodeOrFail(code: RoleCode): Promise<Role> {
    return this.repository.findOneByOrFail({ code });
  }

  public findByNameOrCode(name: string, code: string): Promise<Role[]> {
    return this.repository.find({
      where: [{ name: ILike(escapeLikeText(name.trim())) }, { code }],
    });
  }

  public create({ permissions, ...record }: NewRoleRecord): Promise<Role> {
    return this.repository.manager.transaction(async (manager) => {
      const role = await manager.save(Role, manager.create(Role, record));
      await manager.insert(
        RolePermission,
        permissions.map((permissionCode) => ({ roleId: role.id, permissionCode })),
      );
      return role;
    });
  }

  public update(id: string, changes: Pick<Role, 'name' | 'code'>): Promise<unknown> {
    return this.repository.update({ id }, changes);
  }

  public remove(id: string): Promise<unknown> {
    return this.repository.delete({ id });
  }
}
