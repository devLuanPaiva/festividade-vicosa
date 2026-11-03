import { Injectable } from '@nestjs/common';
import { AccessControlService } from '../../role/services/access-control.service';
import type { UserPermissionsResponseDto } from '../dto/user-permissions-response.dto';
import { UserService } from './user.service';

@Injectable()
export class UserPermissionQueryService {
  public constructor(
    private readonly userService: UserService,
    private readonly accessControlService: AccessControlService,
  ) {}

  public async getPermissions(userId: string): Promise<UserPermissionsResponseDto> {
    const user = await this.userService.findByIdOrFail(userId);
    return this.accessControlService.describeAccess(user);
  }
}
