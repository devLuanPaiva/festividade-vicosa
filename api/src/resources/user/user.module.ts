import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessModule } from '../access/access.module';
import { RoleModule } from '../role/role.module';
import { UserPermissionController } from './controllers/user-permission.controller';
import { UserRoleController } from './controllers/user-role.controller';
import { UserController } from './controllers/user.controller';
import { User } from './entities/user.entity';
import { UserRepository } from './repository/user.repository';
import { PasswordHasher } from './services/password-hasher';
import { UserAccountService } from './services/user-account.service';
import { UserPermissionQueryService } from './services/user-permission-query.service';
import { UserRegistrationService } from './services/user-registration.service';
import { UserPermissionService } from './services/user-permission.service';
import { UserRoleService } from './services/user-role.service';
import { UserService } from './services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RoleModule, AccessModule],
  controllers: [UserController, UserPermissionController, UserRoleController],
  providers: [
    UserService,
    UserRepository,
    PasswordHasher,
    UserAccountService,
    UserRegistrationService,
    UserRoleService,
    UserPermissionService,
    UserPermissionQueryService,
  ],
  exports: [UserService, UserRepository, PasswordHasher],
})
export class UserModule {}
