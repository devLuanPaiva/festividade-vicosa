import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from '../role/role.module';
import { UserPermissionController } from './controllers/user-permission.controller';
import { UserController } from './controllers/user.controller';
import { User } from './entities/user.entity';
import { UserRepository } from './repository/user.repository';
import { AccessPolicyService } from './services/access-policy.service';
import { AdminBootstrapService } from './services/admin-bootstrap.service';
import { PasswordHasher } from './services/password-hasher';
import { UserAccountService } from './services/user-account.service';
import { UserPermissionQueryService } from './services/user-permission-query.service';
import { UserPermissionService } from './services/user-permission.service';
import { UserService } from './services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RoleModule],
  controllers: [UserController, UserPermissionController],
  providers: [
    UserService,
    UserRepository,
    PasswordHasher,
    AdminBootstrapService,
    AccessPolicyService,
    UserAccountService,
    UserPermissionService,
    UserPermissionQueryService,
  ],
  exports: [UserService, PasswordHasher],
})
export class UserModule {}
