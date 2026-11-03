import {
  UnauthorizedException,
  type INestApplication,
  type ModuleMetadata,
  type Provider,
  type Type,
} from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { configureApp } from '../../src/app.setup';
import type { AuthenticatedUser } from '../../src/resources/auth/dto/authenticated-user.dto';
import { JwtAuthGuard } from '../../src/resources/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../src/resources/auth/guards/permissions.guard';
import { AuthenticationService } from '../../src/resources/auth/services/authentication.service';

export function createAuthenticator(
  users: Record<string, AuthenticatedUser>,
): (token: string) => Promise<AuthenticatedUser> {
  return (token) => {
    const user = users[token];
    return user ? Promise.resolve(user) : Promise.reject(new UnauthorizedException());
  };
}

interface E2eDefinition {
  controllers: Type<unknown>[];
  providers: Provider[];
  imports?: ModuleMetadata['imports'];
}

export async function createE2eModuleApp(
  { controllers, providers, imports = [] }: E2eDefinition,
  users: Record<string, AuthenticatedUser>,
): Promise<INestApplication> {
  const moduleFixture = await Test.createTestingModule({
    imports,
    controllers,
    providers: [
      ...providers,
      { provide: AuthenticationService, useValue: { authenticate: createAuthenticator(users) } },
      { provide: APP_GUARD, useClass: JwtAuthGuard },
      { provide: APP_GUARD, useClass: PermissionsGuard },
    ],
  }).compile();
  const app = moduleFixture.createNestApplication();
  configureApp(app, 'http://localhost:3001');
  return app.init();
}

export function createE2eApp(
  controllers: Type<unknown>[],
  providers: Provider[],
  users: Record<string, AuthenticatedUser>,
): Promise<INestApplication> {
  return createE2eModuleApp({ controllers, providers }, users);
}
