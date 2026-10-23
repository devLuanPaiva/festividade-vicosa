import { Injectable } from '@nestjs/common';
import type { RoleCode } from '../../role/enums/role-code.enum';
import { RoleRepository } from '../../role/repository/role.repository';
import type { User } from '../entities/user.entity';
import { changeUserRole, deactivateUser } from '../rules/access-changes';
import { AccessPolicyService } from './access-policy.service';
import { UserService } from './user.service';

@Injectable()
export class UserAccountService {
  public constructor(
    private readonly userService: UserService,
    private readonly roleRepository: RoleRepository,
    private readonly accessPolicy: AccessPolicyService,
  ) {}

  public activate(id: number): Promise<User> {
    return this.userService.setActive(id, true);
  }

  public async deactivate(id: number): Promise<User> {
    await this.userService.findByIdOrFail(id);
    await this.accessPolicy.assertPermissionsManagerRemains(deactivateUser(id));
    return this.userService.setActive(id, false);
  }

  public async changeRole(actorId: number, id: number, roleCode: RoleCode): Promise<User> {
    this.accessPolicy.assertNotSelf(actorId, id);
    await this.userService.findByIdOrFail(id);
    const role = await this.roleRepository.findByCodeOrFail(roleCode);
    await this.accessPolicy.assertPermissionsManagerRemains(changeUserRole(id, role.id));
    return this.userService.setRole(id, role.id);
  }
}
