import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { RoleCode } from '../../role/enums/role-code.enum';
import { RoleRepository } from '../../role/repository/role.repository';
import type { NewUserDto } from '../dto/new-user.dto';
import type { User } from '../entities/user.entity';
import { UserRepository, type UserFilters } from '../repository/user.repository';
import { PasswordHasher } from './password-hasher';
import { apiError } from '../../../common/errors/api-error';

@Injectable()
export class UserService {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  public list(filters: UserFilters): Promise<User[]> {
    return this.userRepository.findAll(filters);
  }

  public async findByIdOrFail(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(apiError('USER_NOT_FOUND', 'UsuÃ¡rio nÃ£o encontrado.', 'id'));
    }
    return user;
  }

  public findActiveByEmail(email: string): Promise<User | null> {
    return this.userRepository.findActiveByEmail(email);
  }

  public findActiveById(id: string): Promise<User | null> {
    return this.userRepository.findActiveById(id);
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

  public async setActive(id: string, active: boolean): Promise<User> {
    await this.findByIdOrFail(id);
    await this.userRepository.updateAccount(id, { active });
    return this.findByIdOrFail(id);
  }

  public async setRole(id: string, roleId: string): Promise<User> {
    await this.findByIdOrFail(id);
    await this.userRepository.updateAccount(id, { roleId });
    return this.findByIdOrFail(id);
  }

  private async assertEmailAvailable(email: string): Promise<void> {
    if (await this.userRepository.findByEmail(email)) {
      throw new ConflictException(
        apiError('EMAIL_ALREADY_EXISTS', 'JÃ¡ existe um usuÃ¡rio com este e-mail.', 'email'),
      );
    }
  }
}
