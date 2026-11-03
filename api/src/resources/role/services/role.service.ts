import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { runUnlessReferenced } from '../../../common/database/foreign-key-violation';
import { apiError } from '../../../common/errors/api-error';
import { slugify } from '../../../common/text/slugify';
import type { CreateRoleDto } from '../dto/create-role.dto';
import type { RoleResponseDto } from '../dto/role-response.dto';
import type { Role } from '../entities/role.entity';
import { toRoleResponse } from '../mappers/role-response.mapper';
import { RolePermissionRepository } from '../repository/role-permission.repository';
import { RoleRepository } from '../repository/role.repository';
import { UserRoleRepository } from '../repository/user-role.repository';

@Injectable()
export class RoleService {
  public constructor(
    private readonly roleRepository: RoleRepository,
    private readonly rolePermissionRepository: RolePermissionRepository,
    private readonly userRoleRepository: UserRoleRepository,
  ) {}

  public async list(): Promise<RoleResponseDto[]> {
    const [roles, rolePermissions, userCounts] = await Promise.all([
      this.roleRepository.findAll(),
      this.rolePermissionRepository.findAll(),
      this.userRoleRepository.countUsersByRole(),
    ]);

    return roles.map((role) => toRoleResponse(role, rolePermissions, userCounts.get(role.id) ?? 0));
  }

  public async get(id: string): Promise<RoleResponseDto> {
    const roles = await this.list();
    const role = roles.find((candidate) => candidate.id === id);
    if (!role) {
      throw this.notFound();
    }
    return role;
  }

  public async findByIdOrFail(id: string): Promise<Role> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw this.notFound();
    }
    return role;
  }

  public async findManyOrFail(ids: string[]): Promise<Role[]> {
    const roles = await this.roleRepository.findByIds(ids);
    if (roles.length !== ids.length) {
      throw new NotFoundException(apiError('ROLE_NOT_FOUND', 'Grupo não encontrado.', 'roleIds'));
    }
    return roles;
  }

  public async create(input: CreateRoleDto): Promise<RoleResponseDto> {
    const code = slugify(input.name);
    await this.assertNameAvailable(input.name, code);
    const role = await this.roleRepository.create({
      name: input.name,
      permissions: input.permissions,
      code,
    });
    return this.get(role.id);
  }

  public async rename(id: string, name: string): Promise<RoleResponseDto> {
    const role = await this.findByIdOrFail(id);
    const code = role.system ? role.code : slugify(name);
    await this.assertNameAvailable(name, code, id);
    await this.roleRepository.update(id, { name, code });
    return this.get(id);
  }

  public async remove(id: string): Promise<void> {
    const role = await this.findByIdOrFail(id);
    if (role.system) {
      throw new ConflictException(
        apiError('SYSTEM_ROLE_PROTECTED', 'Os grupos padrão do sistema não podem ser excluídos.'),
      );
    }
    await runUnlessReferenced(
      () => this.roleRepository.remove(id),
      () =>
        new ConflictException(
          apiError('ROLE_IN_USE', 'Este grupo ainda tem usuários. Mude o grupo deles antes.'),
        ),
    );
  }

  private async assertNameAvailable(name: string, code: string, ignoredId?: string): Promise<void> {
    const sameName = await this.roleRepository.findByNameOrCode(name, code);
    if (sameName.some((role) => role.id !== ignoredId)) {
      throw new ConflictException(
        apiError('ROLE_NAME_ALREADY_EXISTS', 'Já existe um grupo com este nome.', 'name'),
      );
    }
  }

  private notFound(): NotFoundException {
    return new NotFoundException(apiError('ROLE_NOT_FOUND', 'Grupo não encontrado.', 'id'));
  }
}
