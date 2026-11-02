import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermission } from '../role/entities/role-permission.entity';
import { UserPermissionOverride } from '../role/entities/user-permission-override.entity';
import { UserRole } from '../role/entities/user-role.entity';
import { User } from '../user/entities/user.entity';
import { AccessSnapshotRepository } from './repository/access-snapshot.repository';
import { AccessPolicyService } from './services/access-policy.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole, RolePermission, UserPermissionOverride])],
  providers: [AccessSnapshotRepository, AccessPolicyService],
  exports: [AccessPolicyService],
})
export class AccessModule {}
