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
import { Permission } from '../src/resources/role/enums/permission.enum';
import { TeamController } from '../src/resources/team/controllers/team.controller';
import { TeamService } from '../src/resources/team/services/team.service';

const TEAM_ID = '00000000-0000-4000-8000-000000000007';
const CATEGORY_ID = '00000000-0000-4000-8000-000000000005';
const GROUP_ID = '00000000-0000-4000-8000-000000000001';
const TEAMS_PATH = `/categories/${CATEGORY_ID}/teams`;

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

const team = {
  id: TEAM_ID,
  categoryId: CATEGORY_ID,
  groupId: GROUP_ID,
  name: 'Centro',
  slug: 'centro',
  city: 'Viçosa',
  abbreviation: null,
  photoKey: null,
};

const validTeam = { name: 'Centro', city: 'Viçosa' };

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
    controllers: [TeamController],
    providers: [
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

describe('Teams (e2e)', () => {
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
    teamService.listByCategory.mockResolvedValue([team]);
    teamService.findByIdOrFail.mockResolvedValue(team);
    teamService.create.mockResolvedValue(team);
    teamService.update.mockResolvedValue(team);
    teamService.remove.mockResolvedValue(undefined);
  });

  it('lets a visitor list the teams of a category', async () => {
    const response = await request(server()).get(TEAMS_PATH);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ status: 'success', count: 1, results: [team] });
  });

  it('lets a visitor read one team', async () => {
    const response = await request(server()).get(`/teams/${TEAM_ID}`);

    expect(response.body).toEqual({ status: 'success', result: team });
  });

  it('forbids creating a team without the team permission', async () => {
    const response = await request(server())
      .post(TEAMS_PATH)
      .set('Authorization', 'Bearer assistant-token')
      .send(validTeam);

    expect(response.status).toBe(403);
  });

  it('forbids removing a team without the team permission', async () => {
    const response = await request(server())
      .delete(`/teams/${TEAM_ID}`)
      .set('Authorization', 'Bearer assistant-token');

    expect(response.status).toBe(403);
  });

  it('creates a team inside a group', async () => {
    const response = await asManager(
      request(server())
        .post(TEAMS_PATH)
        .send({ ...validTeam, groupId: GROUP_ID }),
    );

    expect(response.status).toBe(201);
    expect(teamService.create).toHaveBeenCalledWith(CATEGORY_ID, {
      ...validTeam,
      groupId: GROUP_ID,
    });
  });

  it.each([
    {
      scenario: 'the group id is invalid',
      body: { ...validTeam, groupId: 'abc' },
      field: 'groupId',
    },
    { scenario: 'the city is missing', body: { name: 'Centro' }, field: 'city' },
  ])('rejects a team when $scenario', async ({ body, field }) => {
    const response = await asManager(request(server()).post(TEAMS_PATH).send(body));

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ errors: { field } });
  });

  it('passes the team filters of the query string to the service', async () => {
    const response = await request(server()).get(
      `${TEAMS_PATH}?city=Vi%C3%A7osa&search=cen&groupId=${GROUP_ID}`,
    );

    expect(response.status).toBe(200);
    expect(teamService.listByCategory).toHaveBeenCalledWith(
      CATEGORY_ID,
      expect.objectContaining({ city: 'Viçosa', search: 'cen', groupId: GROUP_ID }),
    );
  });

  it.each([
    { query: 'groupId=abc', field: 'groupId' },
    { query: 'unknown=1', field: 'unknown' },
  ])('rejects the invalid query $query', async ({ query, field }) => {
    const response = await request(server()).get(`${TEAMS_PATH}?${query}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ errors: { field } });
  });

  it('takes a team out of its group when the group is null', async () => {
    const response = await asManager(
      request(server()).patch(`/teams/${TEAM_ID}`).send({ groupId: null }),
    );

    expect(response.status).toBe(200);
    expect(teamService.update).toHaveBeenCalledWith(TEAM_ID, { groupId: null });
  });

  it('removes a team with no content in the response', async () => {
    const response = await asManager(request(server()).delete(`/teams/${TEAM_ID}`));

    expect(response.status).toBe(204);
    expect(teamService.remove).toHaveBeenCalledWith(TEAM_ID);
  });
});
