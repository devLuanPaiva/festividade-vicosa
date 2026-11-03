import { Injectable } from '@nestjs/common';
import { AccessPolicyService } from '../../access/services/access-policy.service';
import { replaceRolePermissions } from '../../access/rules/access-changes';
import type { RoleResponseDto } from '../dto/role-response.dto';
import type { Permission } from '../enums/permission.enum';
import { RolePermissionRepository } from '../repository/role-permission.repository';
import { RoleService } from './role.service';

@Injectable()
export class RolePermissionService {
  public constructor(
    private readonly roleService: RoleService,
    private readonly rolePermissionRepository: RolePermissionRepository,
    private readonly accessPolicy: AccessPolicyService,
  ) {}

  public async replace(
    actorId: string,
    roleId: string,
    permissions: Permission[],
  ): Promise<RoleResponseDto> {
    await this.roleService.findByIdOrFail(roleId);
    await this.accessPolicy.assertNotMemberOfRole(actorId, roleId);
    await this.accessPolicy.assertPermissionsManagerRemains(
      replaceRolePermissions(roleId, permissions),
    );
    await this.rolePermissionRepository.replace(roleId, permissions);
    return this.roleService.get(roleId);
  }
}
