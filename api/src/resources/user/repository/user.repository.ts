import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, type FindOptionsWhere } from 'typeorm';
import { containsText } from '../../../common/database/text-search';
import type { RoleCode } from '../../role/enums/role-code.enum';
import { User } from '../entities/user.entity';
import type { AccessUser } from '../rules/access-snapshot';

export interface NewUserRecord {
  name: string;
  email: string;
  passwordHash: string;
  roleId: string;
}

export interface UserFilters {
  active?: boolean;
  roleCode?: RoleCode;
  search?: string;
}

function buildWhere(filters: UserFilters): FindOptionsWhere<User>[] {
  const base: FindOptionsWhere<User> = {
    ...(filters.active !== undefined && { active: filters.active }),
    ...(filters.roleCode && { role: { code: filters.roleCode } }),
  };
  if (!filters.search) {
    return [base];
  }
  return [
    { ...base, name: containsText(filters.search) },
    { ...base, email: containsText(filters.search) },
  ];
}

@Injectable()
export class UserRepository {
  public constructor(@InjectRepository(User) private readonly repository: Repository<User>) {}

  public findAll(filters: UserFilters): Promise<User[]> {
    return this.repository.find({
      where: buildWhere(filters),
      relations: { role: true },
      order: { name: 'ASC', id: 'ASC' },
    });
  }

  public findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id }, relations: { role: true } });
  }

  public findByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email: email.toLowerCase() });
  }

  public findActiveByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email: email.toLowerCase(), active: true });
  }

  public findActiveById(id: string): Promise<User | null> {
    return this.repository.findOneBy({ id, active: true });
  }

  public findAccessUsers(): Promise<AccessUser[]> {
    return this.repository.find({ select: { id: true, active: true, roleId: true } });
  }

  public create(record: NewUserRecord): Promise<User> {
    return this.repository.save(
      this.repository.create({ ...record, email: record.email.toLowerCase() }),
    );
  }

  public updateAccount(
    id: string,
    changes: Partial<Pick<User, 'active' | 'roleId'>>,
  ): Promise<unknown> {
    return this.repository.update({ id }, changes);
  }
}
