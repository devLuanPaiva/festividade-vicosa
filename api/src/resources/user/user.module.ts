import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from '../role/role.module';
import { User } from './entities/user.entity';
import { UserRepository } from './repository/user.repository';
import { AdminBootstrapService } from './services/admin-bootstrap.service';
import { PasswordHasher } from './services/password-hasher';
import { UserService } from './services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RoleModule],
  providers: [UserService, UserRepository, PasswordHasher, AdminBootstrapService],
  exports: [UserService, PasswordHasher],
})
export class UserModule {}
