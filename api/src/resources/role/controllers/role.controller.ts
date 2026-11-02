import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put } from '@nestjs/common';
import { ParseIdPipe } from '../../../common/pipes/parse-id.pipe';
import { CurrentUser, RequirePermission } from '../../auth/decorators/decorators';
import type { AuthenticatedUser } from '../../auth/dto/authenticated-user.dto';
import { CreateRoleDto } from '../dto/create-role.dto';
import type { RoleResponseDto } from '../dto/role-response.dto';
import { SetRolePermissionsDto } from '../dto/set-role-permissions.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { Permission } from '../enums/permission.enum';
import { RolePermissionService } from '../services/role-permission.service';
import { RoleService } from '../services/role.service';

@Controller('roles')
export class RoleController {
  public constructor(
    private readonly roleService: RoleService,
    private readonly rolePermissionService: RolePermissionService,
  ) {}

  @Get()
  @RequirePermission(Permission.USER_MANAGE)
  public list(): Promise<RoleResponseDto[]> {
    return this.roleService.list();
  }

  @Get(':id')
  @RequirePermission(Permission.USER_MANAGE)
  public get(@Param('id', ParseIdPipe) id: string): Promise<RoleResponseDto> {
    return this.roleService.get(id);
  }

  @Post()
  @RequirePermission(Permission.USER_MANAGE_PERMISSIONS)
  public create(@Body() input: CreateRoleDto): Promise<RoleResponseDto> {
    return this.roleService.create(input);
  }

  @Patch(':id')
  @RequirePermission(Permission.USER_MANAGE_PERMISSIONS)
  public rename(
    @Param('id', ParseIdPipe) id: string,
    @Body() input: UpdateRoleDto,
  ): Promise<RoleResponseDto> {
    return this.roleService.rename(id, input.name);
  }

  @Put(':id/permissions')
  @RequirePermission(Permission.USER_MANAGE_PERMISSIONS)
  public replacePermissions(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id', ParseIdPipe) id: string,
    @Body() input: SetRolePermissionsDto,
  ): Promise<RoleResponseDto> {
    return this.rolePermissionService.replace(actor.id, id, input.permissions);
  }

  @Delete(':id')
  @HttpCode(204)
  @RequirePermission(Permission.USER_MANAGE_PERMISSIONS)
  public remove(@Param('id', ParseIdPipe) id: string): Promise<void> {
    return this.roleService.remove(id);
  }
}
