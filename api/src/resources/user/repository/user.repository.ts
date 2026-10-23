import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import type { AccessUser } from '../rules/access-snapshot';

export interface NewUserRecord {
  name: string;
  email: string;
  passwordHash: string;
  roleId: number;
}

@Injectable()
export class UserRepository {
  public constructor(@InjectRepository(User) private readonly repository: Repository<User>) {}

  public findAll(): Promise<User[]> {
    return this.repository.find({ relations: { role: true }, order: { id: 'ASC' } });
  }

  public findById(id: number): Promise<User | null> {
    return this.repository.findOne({ where: { id }, relations: { role: true } });
  }

  public findByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email: email.toLowerCase() });
  }

  public findActiveByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email: email.toLowerCase(), active: true });
  }

  public findActiveById(id: number): Promise<User | null> {
    return this.repository.findOneBy({ id, active: true });
  }

  public findAccessUsers(): Promise<AccessUser[]> {
    return this.repository.find({ select: { id: true, active: true, roleId: true } });
  }

  public count(): Promise<number> {
    return this.repository.count();
  }

  public create(record: NewUserRecord): Promise<User> {
    return this.repository.save(
      this.repository.create({ ...record, email: record.email.toLowerCase() }),
    );
  }

  public updateAccount(
    id: number,
    changes: Partial<Pick<User, 'active' | 'roleId'>>,
  ): Promise<unknown> {
    return this.repository.update({ id }, changes);
  }
}
