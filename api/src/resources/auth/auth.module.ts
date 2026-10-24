import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, type JwtModuleOptions } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { RoleModule } from '../role/role.module';
import type { EnvironmentVariables } from '../../config/environment';
import { SessionModule } from '../session/session.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AuthenticationService } from './services/authentication.service';
import { GoogleAuthService } from './services/google-auth.service';
import { GoogleIdentityVerifier } from './services/google-identity-verifier.service';
import { SessionRenewalService } from './services/session-renewal.service';
import { TokenIssuerService } from './services/token-issuer.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';

const DEFAULT_REQUESTS_PER_MINUTE = 100;
const ONE_MINUTE_IN_MILLISECONDS = 60_000;

function createJwtOptions(config: ConfigService<EnvironmentVariables, true>): JwtModuleOptions {
  return {
    secret: config.get('JWT_SECRET', { infer: true }),
    signOptions: { expiresIn: config.get('JWT_EXPIRES_IN', { infer: true }) },
  };
}

@Module({
  imports: [
    JwtModule.registerAsync({ inject: [ConfigService], useFactory: createJwtOptions }),
    ThrottlerModule.forRoot([
      { ttl: ONE_MINUTE_IN_MILLISECONDS, limit: DEFAULT_REQUESTS_PER_MINUTE },
    ]),
    UserModule,
    RoleModule,
    SessionModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleAuthService,
    GoogleIdentityVerifier,
    SessionRenewalService,
    TokenIssuerService,
    AuthenticationService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
})
export class AuthModule {}
