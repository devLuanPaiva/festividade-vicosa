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
import { TeamController } from '../src/resources/team/controllers/team.controller';
import { TeamService } from '../src/resources/team/services/team.service';

const users: Record<string, AuthenticatedUser> = {
  'manager-token': {
    id: 1,
    name: 'Manager',
    email: 'manager@example.com',
    permissions: [Permission.TEAM_MANAGE],
  },
  'assistant-token': { id: 2, name: 'Assistant', email: 'assistant@example.com', permissions: [] },
};

const category = { id: 5, subEventId: 2, name: 'Adulto', gender: Gender.MALE, ageRange: null };
const group = { id: 1, categoryId: 5, name: 'Grupo A' };
const team = { id: 7, categoryId: 5, groupId: 1, name: 'Centro' };

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
const teamService = {
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
    controllers: [CategoryController, MatchGroupController, TeamController],
    providers: [
      { provide: CategoryService, useValue: categoryService },
      { provide: MatchGroupService, useValue: matchGroupService },
      { provide: TeamService, useValue: teamService },
      { provide: AuthenticationService, useValue: { authenticate } },
      { provide: APP_GUARD, useClass: JwtAuthGuard },
      { provide: APP_GUARD, useClass: PermissionsGuard },
    ],
  }).compile();
  const app = moduleFixture.createNestApplication();
  configureApp(app, 'http://localhost:3001');
  return app.init();
}

describe('Categories, groups and teams (e2e)', () => {
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
    teamService.listByCategory.mockResolvedValue([team]);
    teamService.findByIdOrFail.mockResolvedValue(team);
    teamService.create.mockResolvedValue(team);
    teamService.update.mockResolvedValue(team);
    teamService.remove.mockResolvedValue(undefined);
  });

  it.each([
    { path: '/sub-events/2/categories', result: category },
    { path: '/categories/5/groups', result: group },
    { path: '/categories/5/teams', result: team },
  ])('lets a visitor list $path without logging in', async ({ path, result }) => {
    const response = await request(server()).get(path);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ status: 'success', count: 1, results: [result] });
  });

  it('lets a visitor read one team', async () => {
    const response = await request(server()).get('/teams/7');

    expect(response.body).toEqual({ status: 'success', result: team });
  });

  it.each([
    { path: '/sub-events/2/categories', body: { name: 'Adulto', gender: 'MALE' } },
    { path: '/categories/5/groups', body: { name: 'Grupo A' } },
    { path: '/categories/5/teams', body: { name: 'Centro' } },
  ])('requires login to create at $path', async ({ path, body }) => {
    const response = await request(server()).post(path).send(body);

    expect(response.status).toBe(401);
  });

  it.each([
    { path: '/sub-events/2/categories', body: { name: 'Adulto', gender: 'MALE' } },
    { path: '/categories/5/groups', body: { name: 'Grupo A' } },
    { path: '/categories/5/teams', body: { name: 'Centro' } },
  ])('forbids creating at $path without the team permission', async ({ path, body }) => {
    const response = await request(server())
      .post(path)
      .set('Authorization', 'Bearer assistant-token')
      .send(body);

    expect(response.status).toBe(403);
  });

  it('creates a category with a valid body', async () => {
    const response = await asManager(
      request(server()).post('/sub-events/2/categories').send({ name: 'Adulto', gender: 'MALE' }),
    );

    expect(response.status).toBe(201);
    expect(categoryService.create).toHaveBeenCalledWith(2, { name: 'Adulto', gender: 'MALE' });
  });

  it.each([
    {
      scenario: 'the gender is unknown',
      body: { name: 'Adulto', gender: 'OTHER' },
      field: 'gender',
    },
    { scenario: 'the name is empty', body: { name: '', gender: 'MALE' }, field: 'name' },
    { scenario: 'the gender is missing', body: { name: 'Adulto' }, field: 'gender' },
  ])('rejects a category when $scenario', async ({ body, field }) => {
    const response = await asManager(request(server()).post('/sub-events/2/categories').send(body));

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ errors: { code: 'VALIDATION_ERROR', field } });
  });

  it('creates a team inside a group', async () => {
    const response = await asManager(
      request(server()).post('/categories/5/teams').send({ name: 'Centro', groupId: 1 }),
    );

    expect(response.status).toBe(201);
    expect(teamService.create).toHaveBeenCalledWith(5, { name: 'Centro', groupId: 1 });
  });

  it('rejects a team with an invalid group id', async () => {
    const response = await asManager(
      request(server()).post('/categories/5/teams').send({ name: 'Centro', groupId: 'abc' }),
    );

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ errors: { field: 'groupId' } });
  });

  it('takes a team out of its group when the group is null', async () => {
    const response = await asManager(request(server()).patch('/teams/7').send({ groupId: null }));

    expect(response.status).toBe(200);
    expect(teamService.update).toHaveBeenCalledWith(7, { groupId: null });
  });

  it('removes a team with no content in the response', async () => {
    const response = await asManager(request(server()).delete('/teams/7'));

    expect(response.status).toBe(204);
    expect(teamService.remove).toHaveBeenCalledWith(7);
  });

  it('removes a group with no content in the response', async () => {
    const response = await asManager(request(server()).delete('/groups/1'));

    expect(response.status).toBe(204);
    expect(matchGroupService.remove).toHaveBeenCalledWith(1);
  });

  it('forbids removing a team without the team permission', async () => {
    const response = await request(server())
      .delete('/teams/7')
      .set('Authorization', 'Bearer assistant-token');

    expect(response.status).toBe(403);
  });
});
