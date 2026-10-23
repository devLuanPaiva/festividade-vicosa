import { Injectable, Logger, type OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RoleCode } from '../../role/enums/role-code.enum';
import type { EnvironmentVariables } from '../../../config/environment';
import type { NewUserDto } from '../dto/new-user.dto';
import { UserService } from './user.service';

const INITIAL_ADMIN_NAME = 'Administrator';

@Injectable()
export class AdminBootstrapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminBootstrapService.name);

  public constructor(
    private readonly config: ConfigService<EnvironmentVariables, true>,
    private readonly usersService: UserService,
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    if ((await this.usersService.count()) > 0) {
      return;
    }

    const administrator = this.readInitialAdministrator();
    if (!administrator) {
      this.logger.warn('No users exist and ADMIN_EMAIL or ADMIN_INITIAL_PASSWORD is not set');
      return;
    }

    await this.usersService.createWithRole(RoleCode.ADMIN, administrator);
    this.logger.log(`Initial administrator created: ${administrator.email}`);
  }

  private readInitialAdministrator(): NewUserDto | null {
    const email = this.config.get('ADMIN_EMAIL', { infer: true });
    const password = this.config.get('ADMIN_INITIAL_PASSWORD', { infer: true });

    return email && password ? { name: INITIAL_ADMIN_NAME, email, password } : null;
  }
}
