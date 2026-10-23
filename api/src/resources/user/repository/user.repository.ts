import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

export interface NewUserRecord {
  name: string;
  email: string;
  passwordHash: string;
  roleId: number;
}

@Injectable()
export class UserRepository {
  public constructor(@InjectRepository(User) private readonly repository: Repository<User>) {}

  public findActiveByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email: email.toLowerCase(), active: true });
  }

  public findActiveById(id: number): Promise<User | null> {
    return this.repository.findOneBy({ id, active: true });
  }

  public count(): Promise<number> {
    return this.repository.count();
  }

  public create(record: NewUserRecord): Promise<User> {
    return this.repository.save(
      this.repository.create({ ...record, email: record.email.toLowerCase() }),
    );
  }
}
