import { ConflictException, type INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types';
import { apiError } from '../src/common/errors/api-error';
import type { AuthenticatedUser } from '../src/resources/auth/dto/authenticated-user.dto';
import { PermissionController } from '../src/resources/role/controllers/permission.controller';
import { RoleController } from '../src/resources/role/controllers/role.controller';
import { Permission } from '../src/resources/role/enums/permission.enum';
import { RolePermissionService } from '../src/resources/role/services/role-permission.service';
import { RoleService } from '../src/resources/role/services/role.service';
import { createE2eApp } from './support/e2e-app';

const ROLE_ID = '00000000-0000-4000-8000-000000000020';

const users: Record<string, AuthenticatedUser> = {
  'admin-token': {
    id: '00000000-0000-4000-8000-000000000001',
    name: 'Admin',
    email: 'admin@example.com',
    permissions: [Permission.USER_MANAGE, Permission.USER_MANAGE_PERMISSIONS],
  },
  'reader-token': {
    id: '00000000-0000-4000-8000-000000000002',
    name: 'Reader',
    email: 'reader@example.com',
    permissions: [Permission.USER_MANAGE],
  },
};

const role = {
  id: ROLE_ID,
  code: 'voluntarios',
  name: 'Voluntários',
  system: false,
  permissions: [Permission.PHOTO_UPLOAD],
  userCount: 0,
};

const roleService = { list: jest.fn(), create: jest.fn(), remove: jest.fn() };
const rolePermissionService = { replace: jest.fn() };

describe('Groups and permissions (e2e)', () => {
  let app: INestApplication;
  const server = (): App => app.getHttpServer() as App;
  const as = (token: string, call: request.Test): request.Test =>
    call.set('Authorization', `Bearer ${token}`);

  beforeAll(async () => {
    app = await createE2eApp(
      [RoleController, PermissionController],
      [
        { provide: RoleService, useValue: roleService },
        { provide: RolePermissionService, useValue: rolePermissionService },
      ],
      users,
    );
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    roleService.list.mockResolvedValue([role]);
    roleService.create.mockResolvedValue(role);
    rolePermissionService.replace.mockResolvedValue(role);
  });

  it('lets a user who only manages users read the groups and the permission catalog', async () => {
    const groups = await as('reader-token', request(server()).get('/roles'));
    const catalog = await as('reader-token', request(server()).get('/permissions'));

    expect(groups.status).toBe(200);
    const { results } = catalog.body as { results: { code: string }[] };
    expect(results.map(({ code }) => code)).toContain('photo:upload');
  });

  it('forbids creating a group without the permission to manage permissions', async () => {
    const response = await as(
      'reader-token',
      request(server()).post('/roles').send({ name: 'Voluntários', permissions: [] }),
    );

    expect(response.status).toBe(403);
    expect(roleService.create).not.toHaveBeenCalled();
  });

  it('rejects a group with an unknown or repeated permission', async () => {
    const unknown = await as(
      'admin-token',
      request(server())
        .post('/roles')
        .send({ name: 'Voluntários', permissions: ['x:y'] }),
    );
    const repeated = await as(
      'admin-token',
      request(server())
        .put(`/roles/${ROLE_ID}/permissions`)
        .send({ permissions: ['photo:upload', 'photo:upload'] }),
    );

    expect(unknown.status).toBe(400);
    expect(repeated.body).toMatchObject({ errors: { field: 'permissions' } });
  });

  it('answers 409 with the code when a group name already exists', async () => {
    roleService.create.mockRejectedValue(
      new ConflictException(
        apiError('ROLE_NAME_ALREADY_EXISTS', 'Já existe um grupo com este nome.', 'name'),
      ),
    );

    const response = await as(
      'admin-token',
      request(server()).post('/roles').send({ name: 'Voluntários', permissions: [] }),
    );

    expect(response.status).toBe(409);
    expect(response.body).toMatchObject({
      errors: { code: 'ROLE_NAME_ALREADY_EXISTS', field: 'name' },
    });
  });

  it('replaces the permissions of a group on behalf of the logged user', async () => {
    const response = await as(
      'admin-token',
      request(server())
        .put(`/roles/${ROLE_ID}/permissions`)
        .send({ permissions: ['photo:upload'] }),
    );

    expect(response.status).toBe(200);
    expect(rolePermissionService.replace).toHaveBeenCalledWith(
      '00000000-0000-4000-8000-000000000001',
      ROLE_ID,
      [Permission.PHOTO_UPLOAD],
    );
  });

  it('deletes a group and answers 204', async () => {
    roleService.remove.mockResolvedValue(undefined);

    const response = await as('admin-token', request(server()).delete(`/roles/${ROLE_ID}`));

    expect(response.status).toBe(204);
  });
});
