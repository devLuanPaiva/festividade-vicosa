import { ConflictException, UnauthorizedException, type INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { configureApp } from '../src/app.setup';
import type { AuthenticatedUser } from '../src/resources/auth/dto/authenticated-user.dto';
import { JwtAuthGuard } from '../src/resources/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../src/resources/auth/guards/permissions.guard';
import { AuthenticationService } from '../src/resources/auth/services/authentication.service';
import { Permission } from '../src/resources/role/enums/permission.enum';
import { RoleCode } from '../src/resources/role/enums/role-code.enum';
import { UserPermissionController } from '../src/resources/user/controllers/user-permission.controller';
import { UserController } from '../src/resources/user/controllers/user.controller';
import { UserAccountService } from '../src/resources/user/services/user-account.service';
import { UserPermissionQueryService } from '../src/resources/user/services/user-permission-query.service';
import { UserPermissionService } from '../src/resources/user/services/user-permission.service';
import { UserService } from '../src/resources/user/services/user.service';

const users: Record<string, AuthenticatedUser> = {
  'admin-token': {
    id: 1,
    name: 'Admin',
    email: 'admin@example.com',
    permissions: [Permission.USER_MANAGE, Permission.USER_MANAGE_PERMISSIONS],
  },
  'assistant-token': { id: 2, name: 'Assistant', email: 'assistant@example.com', permissions: [] },
};

const storedUser = {
  id: 9,
  name: 'Ana',
  email: 'ana@example.com',
  passwordHash: 'secret-hash',
  active: true,
  role: { code: RoleCode.MANAGER },
  createdAt: new Date('2026-10-22T12:00:00Z'),
};

const validNewUser = {
  name: 'Ana',
  email: 'ana@example.com',
  password: 'a-long-password',
  roleCode: RoleCode.MANAGER,
};

function authenticate(token: string): Promise<AuthenticatedUser> {
  const user = users[token];
  return user ? Promise.resolve(user) : Promise.reject(new UnauthorizedException());
}

const userService = { list: jest.fn(), create: jest.fn() };
const accountService = { activate: jest.fn(), deactivate: jest.fn(), changeRole: jest.fn() };
const permissionService = { setOverride: jest.fn(), removeOverride: jest.fn() };

async function createApp(): Promise<INestApplication> {
  const moduleFixture = await Test.createTestingModule({
    controllers: [UserController, UserPermissionController],
    providers: [
      { provide: UserService, useValue: userService },
      { provide: UserAccountService, useValue: accountService },
      { provide: UserPermissionService, useValue: permissionService },
      { provide: UserPermissionQueryService, useValue: { getPermissions: jest.fn() } },
      { provide: AuthenticationService, useValue: { authenticate } },
      { provide: APP_GUARD, useClass: JwtAuthGuard },
      { provide: APP_GUARD, useClass: PermissionsGuard },
    ],
  }).compile();
  const app = moduleFixture.createNestApplication();
  configureApp(app, 'http://localhost:3001');
  return app.init();
}

describe('User management (e2e)', () => {
  let app: INestApplication;
  const server = (): App => app.getHttpServer() as App;
  const asAdmin = (call: request.Test): request.Test =>
    call.set('Authorization', 'Bearer admin-token');

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    userService.create.mockResolvedValue(storedUser);
    userService.list.mockResolvedValue([storedUser]);
  });

  it('forbids listing users without the permission to manage users', async () => {
    const response = await request(server())
      .get('/users')
      .set('Authorization', 'Bearer assistant-token');

    expect(response.status).toBe(403);
  });

  it('lists users without the password hash', async () => {
    const response = await asAdmin(request(server()).get('/users'));

    expect(response.body).toEqual([
      expect.not.objectContaining({ passwordHash: expect.anything() as unknown }),
    ]);
    expect(response.status).toBe(200);
  });

  it('creates a user with a valid body and answers 201', async () => {
    const response = await asAdmin(request(server()).post('/users').send(validNewUser));

    expect(response.status).toBe(201);
  });

  it.each([
    { scenario: 'the password is too short', body: { ...validNewUser, password: 'short' } },
    { scenario: 'the role code is unknown', body: { ...validNewUser, roleCode: 'OWNER' } },
    { scenario: 'there is an unexpected field', body: { ...validNewUser, active: false } },
  ])('rejects a new user when $scenario', async ({ body }) => {
    const response = await asAdmin(request(server()).post('/users').send(body));

    expect(response.status).toBe(400);
    expect(userService.create).not.toHaveBeenCalled();
  });

  it('answers 409 when the service reports a conflict', async () => {
    userService.create.mockRejectedValue(new ConflictException('already exists'));

    const response = await asAdmin(request(server()).post('/users').send(validNewUser));

    expect(response.status).toBe(409);
  });

  it('rejects a non numeric user id', async () => {
    const response = await asAdmin(request(server()).patch('/users/abc/deactivate'));

    expect(response.status).toBe(400);
  });

  it('rejects an unknown permission on an override', async () => {
    const response = await asAdmin(
      request(server()).put('/users/9/permissions/not-a-permission').send({ effect: 'GRANTED' }),
    );

    expect(response.status).toBe(400);
  });

  it('sets an override and answers 204', async () => {
    permissionService.setOverride.mockResolvedValue(undefined);

    const response = await asAdmin(
      request(server()).put('/users/9/permissions/photo:delete').send({ effect: 'GRANTED' }),
    );

    expect(response.status).toBe(204);
    expect(permissionService.setOverride).toHaveBeenCalledWith(1, {
      userId: 9,
      permission: Permission.PHOTO_DELETE,
      effect: 'GRANTED',
    });
  });
});
