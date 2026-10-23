import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './controllers/role.controller';
import { RolePermission } from './entities/role-permission.entity';
import { Role } from './entities/role.entity';
import { UserPermissionOverride } from './entities/user-permission-override.entity';
import { RolePermissionRepository } from './repository/role-permission.repository';
import { RoleRepository } from './repository/role.repository';
import { UserPermissionOverrideRepository } from './repository/user-permission-override.repository';
import { AccessControlService } from './services/access-control.service';
import { RoleService } from './services/role.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, RolePermission, UserPermissionOverride])],
  controllers: [RoleController],
  providers: [
    AccessControlService,
    RoleService,
    RoleRepository,
    RolePermissionRepository,
    UserPermissionOverrideRepository,
  ],
  exports: [
    AccessControlService,
    RoleRepository,
    RolePermissionRepository,
    UserPermissionOverrideRepository,
  ],
})
export class RoleModule {}
