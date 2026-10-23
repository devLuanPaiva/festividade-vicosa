import { Injectable } from '@nestjs/common';
import { RoleRepository } from '../../role/repository/role.repository';
import type { RoleCode } from '../../role/enums/role-code.enum';
import type { NewUserDto } from '../dto/new-user.dto';
import type { User } from '../entities/user.entity';
import { UserRepository } from '../repository/user.repository';
import { PasswordHasher } from './password-hasher';

@Injectable()
export class UserService {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  public findActiveByEmail(email: string): Promise<User | null> {
    return this.userRepository.findActiveByEmail(email);
  }

  public findActiveById(id: number): Promise<User | null> {
    return this.userRepository.findActiveById(id);
  }

  public count(): Promise<number> {
    return this.userRepository.count();
  }

  public async createWithRole(roleCode: RoleCode, input: NewUserDto): Promise<User> {
    const role = await this.roleRepository.findByCodeOrFail(roleCode);
    const passwordHash = await this.passwordHasher.hash(input.password);

    return this.userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      roleId: role.id,
    });
  }
}
