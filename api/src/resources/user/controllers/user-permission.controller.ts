import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Put } from '@nestjs/common';
import { CurrentUser, RequirePermission } from '../../auth/decorators/decorators';
import type { AuthenticatedUser } from '../../auth/dto/authenticated-user.dto';
import { Permission } from '../../role/enums/permission.enum';
import { SetPermissionOverrideDto } from '../dto/set-permission-override.dto';
import { UserPermissionParamsDto } from '../dto/user-permission-params.dto';
import type { UserPermissionsResponseDto } from '../dto/user-permissions-response.dto';
import { UserPermissionQueryService } from '../services/user-permission-query.service';
import { UserPermissionService } from '../services/user-permission.service';

@Controller('users/:id/permissions')
export class UserPermissionController {
  public constructor(
    private readonly queryService: UserPermissionQueryService,
    private readonly permissionService: UserPermissionService,
  ) {}

  @Get()
  @RequirePermission(Permission.USER_MANAGE)
  public get(@Param('id', ParseIntPipe) id: number): Promise<UserPermissionsResponseDto> {
    return this.queryService.getPermissions(id);
  }

  @Put(':permission')
  @HttpCode(204)
  @RequirePermission(Permission.USER_MANAGE_PERMISSIONS)
  public set(
    @CurrentUser() actor: AuthenticatedUser,
    @Param() { id, permission }: UserPermissionParamsDto,
    @Body() input: SetPermissionOverrideDto,
  ): Promise<void> {
    return this.permissionService.setOverride(actor.id, {
      userId: id,
      permission,
      effect: input.effect,
    });
  }

  @Delete(':permission')
  @HttpCode(204)
  @RequirePermission(Permission.USER_MANAGE_PERMISSIONS)
  public remove(
    @CurrentUser() actor: AuthenticatedUser,
    @Param() { id, permission }: UserPermissionParamsDto,
  ): Promise<void> {
    return this.permissionService.removeOverride(actor.id, id, permission);
  }
}
