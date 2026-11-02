import { Controller, Get } from '@nestjs/common';
import { RequirePermission } from '../../auth/decorators/decorators';
import { Permission } from '../enums/permission.enum';
import { PERMISSION_CATALOG, type PermissionDescription } from '../rules/permission-catalog';

@Controller('permissions')
export class PermissionController {
  @Get()
  @RequirePermission(Permission.USER_MANAGE)
  public list(): PermissionDescription[] {
    return PERMISSION_CATALOG;
  }
}
