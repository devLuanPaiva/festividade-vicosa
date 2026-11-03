import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { apiError } from '../../../common/errors/api-error';
import {
  UserRoleRepository,
  type RoleAssignment,
} from '../../role/repository/user-role.repository';
import type { NewUserDto } from '../dto/new-user.dto';
import type { UpdateUserDto } from '../dto/update-user.dto';
import type { User } from '../entities/user.entity';
import { UserRepository, type UserChanges, type UserFilters } from '../repository/user.repository';
import { attachRoles, type UserWithRoles } from '../rules/user-roles';
import { PasswordHasher } from './password-hasher';

export interface UserListFilters extends UserFilters {
  roleId?: string;
}

@Injectable()
export class UserService {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly userRoleRepository: UserRoleRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  public async list({ roleId, ...filters }: UserListFilters): Promise<UserWithRoles[]> {
    const ids = roleId ? await this.userRoleRepository.findUserIdsByRoleId(roleId) : undefined;
    const users = await this.userRepository.findAll({ ...filters, ids });
    return this.withRoles(users);
  }

  public async getDetails(id: string): Promise<UserWithRoles> {
    const user = await this.findByIdOrFail(id);
    return { user, userRoles: await this.userRoleRepository.findByUserIds([id]) };
  }

  public async findByIdOrFail(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(apiError('USER_NOT_FOUND', 'Usuário não encontrado.', 'id'));
    }
    return user;
  }

  public findActiveByEmail(email: string): Promise<User | null> {
    return this.userRepository.findActiveByEmail(email);
  }

  public findActiveById(id: string): Promise<User | null> {
    return this.userRepository.findActiveById(id);
  }

  public async create(roleId: string, input: NewUserDto): Promise<UserWithRoles> {
    await this.assertEmailAvailable(input.email);
    const passwordHash = await this.passwordHasher.hash(input.password);
    const created = await this.userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      roleId,
    });
    return this.getDetails(created.id);
  }

  public async update(id: string, input: UpdateUserDto): Promise<UserWithRoles> {
    await this.findByIdOrFail(id);
    if (input.email) {
      await this.assertEmailAvailable(input.email, id);
    }
    const changes = await this.toChanges(input);
    if (Object.keys(changes).length > 0) {
      await this.userRepository.update(id, changes);
    }
    return this.getDetails(id);
  }

  public async setActive(id: string, active: boolean): Promise<UserWithRoles> {
    await this.findByIdOrFail(id);
    await this.userRepository.update(id, { active });
    return this.getDetails(id);
  }

  public replaceRoles(id: string, assignments: RoleAssignment[]): Promise<void> {
    return this.userRoleRepository.replaceAssignments(id, assignments);
  }

  public remove(id: string): Promise<unknown> {
    return this.userRepository.remove(id);
  }

  private async withRoles(users: User[]): Promise<UserWithRoles[]> {
    const userRoles = await this.userRoleRepository.findByUserIds(users.map(({ id }) => id));
    return attachRoles(users, userRoles);
  }

  private async toChanges({ name, email, password }: UpdateUserDto): Promise<UserChanges> {
    return {
      ...(name !== undefined && { name }),
      ...(email !== undefined && { email: email.toLowerCase() }),
      ...(password !== undefined && { passwordHash: await this.passwordHasher.hash(password) }),
    };
  }

  private async assertEmailAvailable(email: string, ignoredUserId?: string): Promise<void> {
    const existing = await this.userRepository.findByEmail(email);
    if (existing && existing.id !== ignoredUserId) {
      throw new ConflictException(
        apiError('EMAIL_ALREADY_EXISTS', 'Já existe um usuário com este e-mail.', 'email'),
      );
    }
  }
}
