import { type INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types';
import type { AuthenticatedUser } from '../src/resources/auth/dto/authenticated-user.dto';
import { Permission } from '../src/resources/role/enums/permission.enum';
import { UserRoleController } from '../src/resources/user/controllers/user-role.controller';
import { UserRoleService } from '../src/resources/user/services/user-role.service';
import { createE2eApp } from './support/e2e-app';

const ADMIN_ID = '00000000-0000-4000-8000-000000000001';
const USER_ID = '00000000-0000-4000-8000-000000000009';
const MANAGER_ROLE_ID = '00000000-0000-4000-8000-000000000020';
const ASSISTANT_ROLE_ID = '00000000-0000-4000-8000-000000000021';

const users: Record<string, AuthenticatedUser> = {
  'admin-token': {
    id: ADMIN_ID,
    name: 'Admin',
    email: 'admin@example.com',
    permissions: [Permission.USER_MANAGE, Permission.USER_MANAGE_PERMISSIONS],
  },
  'manager-token': {
    id: '00000000-0000-4000-8000-000000000002',
    name: 'Manager',
    email: 'manager@example.com',
    permissions: [Permission.USER_MANAGE],
  },
};

const assignedUser = {
  user: { id: USER_ID, name: 'Ana', email: 'ana@example.com', active: true, createdAt: new Date() },
  userRoles: [
    { roleId: MANAGER_ROLE_ID, isPrimary: false, role: { name: 'Gerente' } },
    { roleId: ASSISTANT_ROLE_ID, isPrimary: true, role: { name: 'Assistente' } },
  ],
};

const userRoleService = { assign: jest.fn() };
const validAssignment = {
  roleIds: [MANAGER_ROLE_ID, ASSISTANT_ROLE_ID],
  primaryRoleId: ASSISTANT_ROLE_ID,
};

describe('User groups (e2e)', () => {
  let app: INestApplication;
  const server = (): App => app.getHttpServer() as App;
  const assign = (token: string, body: object): request.Test =>
    request(server())
      .put(`/users/${USER_ID}/roles`)
      .set('Authorization', `Bearer ${token}`)
      .send(body);

  beforeAll(async () => {
    app = await createE2eApp(
      [UserRoleController],
      [{ provide: UserRoleService, useValue: userRoleService }],
      users,
    );
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    userRoleService.assign.mockResolvedValue(assignedUser);
  });

  it('answers with every group of the user and which one is the primary', async () => {
    const response = await assign('admin-token', validAssignment);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      result: {
        roles: [
          { id: MANAGER_ROLE_ID, name: 'Gerente', primary: false },
          { id: ASSISTANT_ROLE_ID, name: 'Assistente', primary: true },
        ],
      },
    });
    expect(userRoleService.assign).toHaveBeenCalledWith(ADMIN_ID, USER_ID, validAssignment);
  });

  it('forbids assigning groups without the permission to manage permissions', async () => {
    const response = await assign('manager-token', validAssignment);

    expect(response.status).toBe(403);
    expect(userRoleService.assign).not.toHaveBeenCalled();
  });

  it('rejects an assignment without groups', async () => {
    const response = await assign('admin-token', { roleIds: [], primaryRoleId: MANAGER_ROLE_ID });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ errors: { field: 'roleIds' } });
    expect(userRoleService.assign).not.toHaveBeenCalled();
  });
});
