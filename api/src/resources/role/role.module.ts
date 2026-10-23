import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermission } from './entities/role-permission.entity';
import { Role } from './entities/role.entity';
import { UserPermissionOverride } from './entities/user-permission-override.entity';
import { RolePermissionRepository } from './repository/role-permission.repository';
import { RoleRepository } from './repository/role.repository';
import { UserPermissionOverrideRepository } from './repository/user-permission-override.repository';
import { AccessControlService } from './services/access-control.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, RolePermission, UserPermissionOverride])],
  providers: [
    AccessControlService,
    RoleRepository,
    RolePermissionRepository,
    UserPermissionOverrideRepository,
  ],
  exports: [AccessControlService, RoleRepository],
})
export class RoleModule {}
