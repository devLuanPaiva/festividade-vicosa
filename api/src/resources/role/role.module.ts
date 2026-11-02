import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessModule } from '../access/access.module';
import { PermissionController } from './controllers/permission.controller';
import { RoleController } from './controllers/role.controller';
import { RolePermission } from './entities/role-permission.entity';
import { Role } from './entities/role.entity';
import { UserPermissionOverride } from './entities/user-permission-override.entity';
import { UserRole } from './entities/user-role.entity';
import { RolePermissionRepository } from './repository/role-permission.repository';
import { RoleRepository } from './repository/role.repository';
import { UserPermissionOverrideRepository } from './repository/user-permission-override.repository';
import { UserRoleRepository } from './repository/user-role.repository';
import { AccessControlService } from './services/access-control.service';
import { RolePermissionService } from './services/role-permission.service';
import { RoleService } from './services/role.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, RolePermission, UserPermissionOverride, UserRole]),
    AccessModule,
  ],
  controllers: [RoleController, PermissionController],
  providers: [
    AccessControlService,
    RoleService,
    RolePermissionService,
    RoleRepository,
    RolePermissionRepository,
    UserPermissionOverrideRepository,
    UserRoleRepository,
  ],
  exports: [
    AccessControlService,
    RoleService,
    RoleRepository,
    RolePermissionRepository,
    UserPermissionOverrideRepository,
    UserRoleRepository,
  ],
})
export class RoleModule {}
