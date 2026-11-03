import { BadRequestException, Injectable } from '@nestjs/common';
import { apiError } from '../../../common/errors/api-error';
import { assignUserRoles } from '../../access/rules/access-changes';
import { AccessPolicyService } from '../../access/services/access-policy.service';
import { RoleService } from '../../role/services/role.service';
import type { AssignRolesDto } from '../dto/assign-roles.dto';
import { toRoleAssignments, type UserWithRoles } from '../rules/user-roles';
import { UserService } from './user.service';

@Injectable()
export class UserRoleService {
  public constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly accessPolicy: AccessPolicyService,
  ) {}

  public async assign(
    actorId: string,
    userId: string,
    { roleIds, primaryRoleId }: AssignRolesDto,
  ): Promise<UserWithRoles> {
    this.accessPolicy.assertNotSelf(actorId, userId);
    await this.userService.findByIdOrFail(userId);
    this.assertPrimaryRoleAssigned(roleIds, primaryRoleId);
    await this.roleService.findManyOrFail(roleIds);
    await this.accessPolicy.assertPermissionsManagerRemains(assignUserRoles(userId, roleIds));
    await this.userService.replaceRoles(userId, toRoleAssignments(roleIds, primaryRoleId));
    return this.userService.getDetails(userId);
  }

  private assertPrimaryRoleAssigned(roleIds: string[], primaryRoleId: string): void {
    if (!roleIds.includes(primaryRoleId)) {
      throw new BadRequestException(
        apiError(
          'PRIMARY_ROLE_NOT_ASSIGNED',
          'O grupo principal precisa estar entre os grupos do usuário.',
          'primaryRoleId',
        ),
      );
    }
  }
}
