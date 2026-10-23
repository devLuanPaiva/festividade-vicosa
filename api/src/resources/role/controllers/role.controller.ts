import { Controller, Get } from '@nestjs/common';
import { RequirePermission } from '../../auth/decorators/decorators';
import type { RoleResponseDto } from '../dto/role-response.dto';
import { Permission } from '../enums/permission.enum';
import { RoleService } from '../services/role.service';

@Controller('roles')
export class RoleController {
  public constructor(private readonly roleService: RoleService) {}

  @Get()
  @RequirePermission(Permission.USER_MANAGE)
  public list(): Promise<RoleResponseDto[]> {
    return this.roleService.list();
  }
}
