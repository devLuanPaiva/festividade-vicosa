import { Body, Controller, Param, Put } from '@nestjs/common';
import { ParseIdPipe } from '../../../common/pipes/parse-id.pipe';
import { CurrentUser, RequirePermission } from '../../auth/decorators/decorators';
import type { AuthenticatedUser } from '../../auth/dto/authenticated-user.dto';
import { Permission } from '../../role/enums/permission.enum';
import { AssignRolesDto } from '../dto/assign-roles.dto';
import type { UserResponseDto } from '../dto/user-response.dto';
import { toUserResponse } from '../mappers/user-response.mapper';
import { UserRoleService } from '../services/user-role.service';

@Controller('users/:id/roles')
export class UserRoleController {
  public constructor(private readonly userRoleService: UserRoleService) {}

  @Put()
  @RequirePermission(Permission.USER_MANAGE_PERMISSIONS)
  public async assign(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id', ParseIdPipe) id: string,
    @Body() input: AssignRolesDto,
  ): Promise<UserResponseDto> {
    return toUserResponse(await this.userRoleService.assign(actor.id, id, input));
  }
}
