import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, type FindOptionsWhere } from 'typeorm';
import { containsText } from '../../../common/database/text-search';
import { UserRole } from '../../role/entities/user-role.entity';
import { User } from '../entities/user.entity';

export interface NewUserRecord {
  name: string;
  email: string;
  passwordHash: string;
  roleId: string;
}

export interface UserFilters {
  active?: boolean;
  ids?: string[];
  search?: string;
}

export type UserChanges = Partial<Pick<User, 'name' | 'email' | 'passwordHash' | 'active'>>;

function buildWhere(filters: UserFilters): FindOptionsWhere<User>[] {
  const base: FindOptionsWhere<User> = {
    ...(filters.active !== undefined && { active: filters.active }),
    ...(filters.ids && { id: In(filters.ids) }),
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
      order: { name: 'ASC', id: 'ASC' },
    });
  }

  public findById(id: string): Promise<User | null> {
    return this.repository.findOneBy({ id });
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

  public create({ roleId, ...record }: NewUserRecord): Promise<User> {
    return this.repository.manager.transaction(async (manager) => {
      const user = await manager.save(
        User,
        manager.create(User, { ...record, email: record.email.toLowerCase() }),
      );
      await manager.insert(UserRole, { userId: user.id, roleId, isPrimary: true });
      return user;
    });
  }

  public update(id: string, changes: UserChanges): Promise<unknown> {
    return this.repository.update({ id }, changes);
  }

  public remove(id: string): Promise<unknown> {
    return this.repository.delete({ id });
  }
}
