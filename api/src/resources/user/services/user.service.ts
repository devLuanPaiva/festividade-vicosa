import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { RoleCode } from '../../role/enums/role-code.enum';
import { RoleRepository } from '../../role/repository/role.repository';
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

  public list(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  public async findByIdOrFail(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  public findActiveByEmail(email: string): Promise<User | null> {
    return this.userRepository.findActiveByEmail(email);
  }

  public findActiveById(id: number): Promise<User | null> {
    return this.userRepository.findActiveById(id);
  }

  public count(): Promise<number> {
    return this.userRepository.count();
  }

  public async create(roleCode: RoleCode, input: NewUserDto): Promise<User> {
    await this.assertEmailAvailable(input.email);
    const created = await this.createWithRole(roleCode, input);
    return this.findByIdOrFail(created.id);
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

  public async setActive(id: number, active: boolean): Promise<User> {
    await this.findByIdOrFail(id);
    await this.userRepository.updateAccount(id, { active });
    return this.findByIdOrFail(id);
  }

  public async setRole(id: number, roleId: number): Promise<User> {
    await this.findByIdOrFail(id);
    await this.userRepository.updateAccount(id, { roleId });
    return this.findByIdOrFail(id);
  }

  private async assertEmailAvailable(email: string): Promise<void> {
    if (await this.userRepository.findByEmail(email)) {
      throw new ConflictException('A user with this email already exists');
    }
  }
}
