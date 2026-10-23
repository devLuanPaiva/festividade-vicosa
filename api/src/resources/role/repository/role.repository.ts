import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import type { RoleCode } from '../enums/role-code.enum';

@Injectable()
export class RoleRepository {
  public constructor(@InjectRepository(Role) private readonly repository: Repository<Role>) {}

  public findByCodeOrFail(code: RoleCode): Promise<Role> {
    return this.repository.findOneByOrFail({ code });
  }
}
