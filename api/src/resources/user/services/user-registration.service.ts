import { Injectable } from '@nestjs/common';
import { RoleService } from '../../role/services/role.service';
import type { NewUserDto } from '../dto/new-user.dto';
import type { UserWithRoles } from '../rules/user-roles';
import { UserService } from './user.service';

@Injectable()
export class UserRegistrationService {
  public constructor(
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  public async create(roleId: string, input: NewUserDto): Promise<UserWithRoles> {
    await this.roleService.findByIdOrFail(roleId);
    return this.userService.create(roleId, input);
  }
}
