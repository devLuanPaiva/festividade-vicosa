import { ConflictException, type INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types';
import { apiError } from '../src/common/errors/api-error';
import type { AuthenticatedUser } from '../src/resources/auth/dto/authenticated-user.dto';
import { Permission } from '../src/resources/role/enums/permission.enum';
import { UserPermissionController } from '../src/resources/user/controllers/user-permission.controller';
import { UserController } from '../src/resources/user/controllers/user.controller';
import { UserAccountService } from '../src/resources/user/services/user-account.service';
import { UserPermissionQueryService } from '../src/resources/user/services/user-permission-query.service';
import { UserRegistrationService } from '../src/resources/user/services/user-registration.service';
import { UserPermissionService } from '../src/resources/user/services/user-permission.service';
import { UserService } from '../src/resources/user/services/user.service';
import { createE2eApp } from './support/e2e-app';

const users: Record<string, AuthenticatedUser> = {
  'admin-token': {
    id: '00000000-0000-4000-8000-000000000001',
    name: 'Admin',
    email: 'admin@example.com',
    permissions: [Permission.USER_MANAGE, Permission.USER_MANAGE_PERMISSIONS],
  },
  'assistant-token': {
    id: '00000000-0000-4000-8000-000000000002',
    name: 'Assistant',
    email: 'assistant@example.com',
    permissions: [],
  },
};

const MANAGER_ROLE_ID = '00000000-0000-4000-8000-000000000020';

const storedUser = {
  user: {
    id: '00000000-0000-4000-8000-000000000009',
    name: 'Ana',
    email: 'ana@example.com',
    passwordHash: 'secret-hash',
    active: true,
    createdAt: new Date('2026-10-22T12:00:00Z'),
  },
  userRoles: [{ roleId: MANAGER_ROLE_ID, isPrimary: true, role: { name: 'Gerente' } }],
};

const validNewUser = {
  name: 'Ana',
  email: 'ana@example.com',
  password: 'a-long-password',
  roleId: MANAGER_ROLE_ID,
};

const userService = { list: jest.fn(), getDetails: jest.fn(), update: jest.fn() };
const registrationService = { create: jest.fn() };
const accountService = { activate: jest.fn(), deactivate: jest.fn(), remove: jest.fn() };
const permissionService = { setOverride: jest.fn(), removeOverride: jest.fn() };

function createApp(): Promise<INestApplication> {
  return createE2eApp(
    [UserController, UserPermissionController],
    [
      { provide: UserService, useValue: userService },
      { provide: UserRegistrationService, useValue: registrationService },
      { provide: UserAccountService, useValue: accountService },
      { provide: UserPermissionService, useValue: permissionService },
      { provide: UserPermissionQueryService, useValue: { getPermissions: jest.fn() } },
    ],
    users,
  );
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
    registrationService.create.mockResolvedValue(storedUser);
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

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ status: 'success', count: 1, currentPage: 1 });
    expect(JSON.stringify(response.body)).not.toContain('passwordHash');
  });

  it('creates a user with a valid body and answers 201 with the groups', async () => {
    const response = await asAdmin(request(server()).post('/users').send(validNewUser));

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      result: { roles: [{ id: MANAGER_ROLE_ID, name: 'Gerente', primary: true }] },
    });
  });

  it('updates part of a user and never returns the password hash', async () => {
    userService.update.mockResolvedValue(storedUser);

    const response = await asAdmin(
      request(server()).patch(`/users/${storedUser.user.id}`).send({ name: 'Ana Maria' }),
    );

    expect(response.status).toBe(200);
    expect(JSON.stringify(response.body)).not.toContain('passwordHash');
  });

  it('rejects a short password when editing a user', async () => {
    const response = await asAdmin(
      request(server()).patch(`/users/${storedUser.user.id}`).send({ password: '123' }),
    );

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      errors: { code: 'VALIDATION_ERROR', field: 'password' },
    });
  });

  it('deletes a user and answers 204', async () => {
    accountService.remove.mockResolvedValue(undefined);

    const response = await asAdmin(request(server()).delete(`/users/${storedUser.user.id}`));

    expect(response.status).toBe(204);
    expect(accountService.remove).toHaveBeenCalledWith(
      users['admin-token']?.id,
      storedUser.user.id,
    );
  });

  it.each([
    {
      scenario: 'there is an unexpected field',
      body: { ...validNewUser, active: false },
      field: 'active',
      detail: 'O campo "active" não é permitido.',
    },
  ])('rejects a new user when $scenario', async ({ body, field, detail }) => {
    const response = await asAdmin(request(server()).post('/users').send(body));

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Requisição inválida',
      data: null,
      errors: { code: 'VALIDATION_ERROR', field, detail },
    });
    expect(registrationService.create).not.toHaveBeenCalled();
  });

  it('answers 409 when the service reports a conflict', async () => {
    registrationService.create.mockRejectedValue(
      new ConflictException(
        apiError('EMAIL_ALREADY_EXISTS', 'Já existe um usuário com este e-mail.', 'email'),
      ),
    );

    const response = await asAdmin(request(server()).post('/users').send(validNewUser));

    expect(response.status).toBe(409);
    expect(response.body).toMatchObject({
      message: 'Conflito de dados',
      errors: {
        code: 'EMAIL_ALREADY_EXISTS',
        field: 'email',
        detail: 'Já existe um usuário com este e-mail.',
      },
    });
  });

  it('rejects a non numeric user id', async () => {
    const response = await asAdmin(request(server()).patch('/users/abc/deactivate'));

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ errors: { code: 'INVALID_ID', field: 'id' } });
  });

  it('rejects an unknown permission on an override', async () => {
    const response = await asAdmin(
      request(server())
        .put('/users/00000000-0000-4000-8000-000000000009/permissions/not-a-permission')
        .send({ effect: 'GRANTED' }),
    );

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      errors: {
        code: 'VALIDATION_ERROR',
        field: 'permission',
        detail: 'A permissão informada não existe.',
      },
    });
  });

  it('sets an override and answers 204', async () => {
    permissionService.setOverride.mockResolvedValue(undefined);

    const response = await asAdmin(
      request(server())
        .put('/users/00000000-0000-4000-8000-000000000009/permissions/photo:delete')
        .send({ effect: 'GRANTED' }),
    );

    expect(response.status).toBe(204);
    expect(permissionService.setOverride).toHaveBeenCalledWith(
      '00000000-0000-4000-8000-000000000001',
      {
        userId: '00000000-0000-4000-8000-000000000009',
        permission: Permission.PHOTO_DELETE,
        effect: 'GRANTED',
      },
    );
  });
});
