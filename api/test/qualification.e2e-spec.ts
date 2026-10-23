import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types';
import type { AuthenticatedUser } from '../src/resources/auth/dto/authenticated-user.dto';
import { QualificationController } from '../src/resources/qualification/controllers/qualification.controller';
import { QualificationService } from '../src/resources/qualification/services/qualification.service';
import { Permission } from '../src/resources/role/enums/permission.enum';
import { createE2eApp } from './support/e2e-app';

const GROUP_ID = '00000000-0000-4000-8000-000000000001';
const TEAM_A = '00000000-0000-4000-8000-0000000000a1';
const TEAM_B = '00000000-0000-4000-8000-0000000000b2';
const QUALIFIED_PATH = `/groups/${GROUP_ID}/qualified`;

const users: Record<string, AuthenticatedUser> = {
  'manager-token': {
    id: '00000000-0000-4000-8000-000000000001',
    name: 'Manager',
    email: 'manager@example.com',
    permissions: [Permission.TEAM_MANAGE],
  },
  'scorer-token': {
    id: '00000000-0000-4000-8000-000000000002',
    name: 'Scorer',
    email: 'scorer@example.com',
    permissions: [Permission.MATCH_RECORD_SCORE],
  },
};

const qualificationService = { confirm: jest.fn() };

describe('Qualification (e2e)', () => {
  let app: INestApplication;
  const server = (): App => app.getHttpServer() as App;
  const as = (token: string, call: request.Test): request.Test =>
    call.set('Authorization', `Bearer ${token}`);

  beforeAll(async () => {
    app = await createE2eApp(
      [QualificationController],
      [{ provide: QualificationService, useValue: qualificationService }],
      users,
    );
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    qualificationService.confirm.mockResolvedValue([
      { groupId: GROUP_ID, teamId: TEAM_B, position: 1 },
      { groupId: GROUP_ID, teamId: TEAM_A, position: 2 },
    ]);
  });

  it('requires login, then the team permission, to confirm the qualified teams', async () => {
    const body = { teamIds: [TEAM_A] };
    const anonymous = await request(server()).put(QUALIFIED_PATH).send(body);
    const scorer = await as('scorer-token', request(server()).put(QUALIFIED_PATH).send(body));

    expect(anonymous.status).toBe(401);
    expect(scorer.status).toBe(403);
  });

  it('confirms the teams in order and answers with their positions', async () => {
    const response = await as(
      'manager-token',
      request(server())
        .put(QUALIFIED_PATH)
        .send({ teamIds: [TEAM_B, TEAM_A] }),
    );

    expect(response.status).toBe(200);
    expect(qualificationService.confirm).toHaveBeenCalledWith(GROUP_ID, [TEAM_B, TEAM_A]);
    expect(response.body).toMatchObject({
      results: [
        { teamId: TEAM_B, position: 1 },
        { teamId: TEAM_A, position: 2 },
      ],
    });
    expect(response.body).not.toHaveProperty('results.0.groupId');
  });

  it('accepts an empty list to clear the confirmation', async () => {
    const response = await as(
      'manager-token',
      request(server()).put(QUALIFIED_PATH).send({ teamIds: [] }),
    );

    expect(response.status).toBe(200);
  });

  it.each([
    { scenario: 'teamIds is missing', body: {} },
    { scenario: 'a team id is not a uuid', body: { teamIds: ['1'] } },
    { scenario: 'teamIds is not a list', body: { teamIds: TEAM_A } },
  ])('rejects the confirmation when $scenario', async ({ body }) => {
    const response = await as('manager-token', request(server()).put(QUALIFIED_PATH).send(body));

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ errors: { field: 'teamIds' } });
  });
});
