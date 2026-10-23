import { Controller, Get, UnauthorizedException, type INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { ThrottlerModule } from '@nestjs/throttler';
import request from 'supertest';
import type { App } from 'supertest/types';
import { Permission } from '../src/resources/role/enums/permission.enum';
import { configureApp } from '../src/app.setup';
import { AuthController } from '../src/resources/auth/controllers/auth.controller';
import { AuthService } from '../src/resources/auth/services/auth.service';
import type { AuthenticatedUser } from '../src/resources/auth/dto/authenticated-user.dto';
import { AuthenticationService } from '../src/resources/auth/services/authentication.service';
import { RequirePermission } from '../src/resources/auth/decorators/decorators';
import { JwtAuthGuard } from '../src/resources/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../src/resources/auth/guards/permissions.guard';

const ASSISTANT_TOKEN = 'assistant-token';

const assistant: AuthenticatedUser = {
  id: '00000000-0000-4000-8000-000000000002',
  name: 'Assistant',
  email: 'assistant@example.com',
  permissions: [Permission.MATCH_RECORD_SCORE],
};

@Controller('protected')
class ProtectedController {
  @Get('scores')
  @RequirePermission(Permission.MATCH_RECORD_SCORE)
  public scores(): string {
    return 'scores';
  }

  @Get('users')
  @RequirePermission(Permission.USER_MANAGE)
  public users(): string {
    return 'users';
  }
}

function authenticate(token: string): Promise<AuthenticatedUser> {
  return token === ASSISTANT_TOKEN
    ? Promise.resolve(assistant)
    : Promise.reject(new UnauthorizedException());
}

async function createApp(): Promise<INestApplication> {
  const moduleFixture = await Test.createTestingModule({
    imports: [ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }])],
    controllers: [AuthController, ProtectedController],
    providers: [
      { provide: AuthService, useValue: { login: jest.fn() } },
      { provide: AuthenticationService, useValue: { authenticate } },
      { provide: APP_GUARD, useClass: JwtAuthGuard },
      { provide: APP_GUARD, useClass: PermissionsGuard },
    ],
  }).compile();
  const app = moduleFixture.createNestApplication();
  configureApp(app, 'http://localhost:3001');
  return app.init();
}

describe('Authentication and authorization (e2e)', () => {
  let app: INestApplication;

  const get = (path: string, token?: string): request.Test => {
    const call = request(app.getHttpServer() as App).get(path);
    return token ? call.set('Authorization', `Bearer ${token}`) : call;
  };

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejects a protected route without a token', async () => {
    const response = await get('/protected/scores');

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      status: 'error',
      errors: { code: 'MISSING_TOKEN', detail: 'Informe o token de acesso para continuar.' },
    });
  });

  it('rejects a protected route with an invalid token', async () => {
    const response = await get('/protected/scores', 'wrong-token');

    expect(response.status).toBe(401);
  });

  it('allows a user that has the required permission', async () => {
    const response = await get('/protected/scores', ASSISTANT_TOKEN);

    expect(response.status).toBe(200);
  });

  it('forbids a user that lacks the required permission', async () => {
    const response = await get('/protected/users', ASSISTANT_TOKEN);

    expect(response.status).toBe(403);
    expect(response.body).toMatchObject({
      errors: {
        code: 'MISSING_PERMISSION',
        detail: 'Você não tem permissão para realizar esta ação.',
      },
    });
  });

  it('returns the current user with the permissions on /auth/me', async () => {
    const response = await get('/auth/me', ASSISTANT_TOKEN);

    expect(response.body).toEqual({ status: 'success', result: assistant });
  });

  it('rejects a login with an invalid body before reaching the service', async () => {
    const response = await request(app.getHttpServer() as App)
      .post('/auth/login')
      .send({ email: 'not-an-email', password: 'secret' });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      errors: { code: 'VALIDATION_ERROR', field: 'email', detail: 'Informe um e-mail válido.' },
    });
  });
});
