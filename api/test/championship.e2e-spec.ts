import { UnauthorizedException, type INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { configureApp } from '../src/app.setup';
import type { AuthenticatedUser } from '../src/resources/auth/dto/authenticated-user.dto';
import { JwtAuthGuard } from '../src/resources/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../src/resources/auth/guards/permissions.guard';
import { AuthenticationService } from '../src/resources/auth/services/authentication.service';
import { CategoryController } from '../src/resources/category/controllers/category.controller';
import { Gender } from '../src/resources/category/enums/gender.enum';
import { CategoryService } from '../src/resources/category/services/category.service';
import { MatchGroupController } from '../src/resources/match-group/controllers/match-group.controller';
import { MatchGroupService } from '../src/resources/match-group/services/match-group.service';
import { Permission } from '../src/resources/role/enums/permission.enum';

const users: Record<string, AuthenticatedUser> = {
  'manager-token': {
    id: '00000000-0000-4000-8000-000000000001',
    name: 'Manager',
    email: 'manager@example.com',
    permissions: [Permission.TEAM_MANAGE],
  },
  'assistant-token': {
    id: '00000000-0000-4000-8000-000000000002',
    name: 'Assistant',
    email: 'assistant@example.com',
    permissions: [],
  },
};

const category = {
  id: '00000000-0000-4000-8000-000000000005',
  subEventId: '00000000-0000-4000-8000-000000000002',
  name: 'Adulto',
  gender: Gender.MALE,
  ageRange: null,
};
const group = {
  id: '00000000-0000-4000-8000-000000000001',
  categoryId: '00000000-0000-4000-8000-000000000005',
  name: 'Grupo A',
};

const categoryService = {
  listBySubEvent: jest.fn(),
  findByIdOrFail: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};
const matchGroupService = {
  listByCategory: jest.fn(),
  findByIdOrFail: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

function authenticate(token: string): Promise<AuthenticatedUser> {
  const user = users[token];
  return user ? Promise.resolve(user) : Promise.reject(new UnauthorizedException());
}

async function createApp(): Promise<INestApplication> {
  const moduleFixture = await Test.createTestingModule({
    controllers: [CategoryController, MatchGroupController],
    providers: [
      { provide: CategoryService, useValue: categoryService },
      { provide: MatchGroupService, useValue: matchGroupService },
      { provide: AuthenticationService, useValue: { authenticate } },
      { provide: APP_GUARD, useClass: JwtAuthGuard },
      { provide: APP_GUARD, useClass: PermissionsGuard },
    ],
  }).compile();
  const app = moduleFixture.createNestApplication();
  configureApp(app, 'http://localhost:3001');
  return app.init();
}

describe('Categories and groups (e2e)', () => {
  let app: INestApplication;
  const server = (): App => app.getHttpServer() as App;
  const asManager = (call: request.Test): request.Test =>
    call.set('Authorization', 'Bearer manager-token');

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    categoryService.listBySubEvent.mockResolvedValue([category]);
    categoryService.findByIdOrFail.mockResolvedValue(category);
    categoryService.create.mockResolvedValue(category);
    matchGroupService.listByCategory.mockResolvedValue([group]);
    matchGroupService.create.mockResolvedValue(group);
  });

  it.each([
    { path: '/sub-events/00000000-0000-4000-8000-000000000002/categories', result: category },
    { path: '/categories/00000000-0000-4000-8000-000000000005/groups', result: group },
  ])('lets a visitor list $path without logging in', async ({ path, result }) => {
    const response = await request(server()).get(path);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ status: 'success', count: 1, results: [result] });
  });

  it.each([
    {
      path: '/sub-events/00000000-0000-4000-8000-000000000002/categories',
      body: { name: 'Adulto', gender: 'MALE' },
    },
    { path: '/categories/00000000-0000-4000-8000-000000000005/groups', body: { name: 'Grupo A' } },
  ])('forbids creating at $path without the team permission', async ({ path, body }) => {
    const response = await request(server())
      .post(path)
      .set('Authorization', 'Bearer assistant-token')
      .send(body);

    expect(response.status).toBe(403);
  });

  it('creates a category with a valid body', async () => {
    const response = await asManager(
      request(server())
        .post('/sub-events/00000000-0000-4000-8000-000000000002/categories')
        .send({ name: 'Adulto', gender: 'MALE' }),
    );

    expect(response.status).toBe(201);
    expect(categoryService.create).toHaveBeenCalledWith('00000000-0000-4000-8000-000000000002', {
      name: 'Adulto',
      gender: 'MALE',
    });
  });

  it.each([
    {
      scenario: 'the gender is unknown',
      body: { name: 'Adulto', gender: 'OTHER' },
      field: 'gender',
    },
  ])('rejects a category when $scenario', async ({ body, field }) => {
    const response = await asManager(
      request(server())
        .post('/sub-events/00000000-0000-4000-8000-000000000002/categories')
        .send(body),
    );

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ errors: { code: 'VALIDATION_ERROR', field } });
  });

  it.each(['gender=OTHER'])('rejects the invalid category filter %s', async (query) => {
    const response = await request(server()).get(
      `/sub-events/00000000-0000-4000-8000-000000000002/categories?${query}`,
    );

    expect(response.status).toBe(400);
  });

  it('removes a group with no content in the response', async () => {
    const response = await asManager(
      request(server()).delete('/groups/00000000-0000-4000-8000-000000000001'),
    );

    expect(response.status).toBe(204);
    expect(matchGroupService.remove).toHaveBeenCalledWith('00000000-0000-4000-8000-000000000001');
  });
});
