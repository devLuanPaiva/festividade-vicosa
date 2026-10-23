import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types';
import type { AuthenticatedUser } from '../src/resources/auth/dto/authenticated-user.dto';
import { MatchController } from '../src/resources/match/controllers/match.controller';
import { MatchRound, MatchStage, MatchStatus } from '../src/resources/match/enums/match.enums';
import { MatchResultService } from '../src/resources/match/services/match-result.service';
import { MatchService } from '../src/resources/match/services/match.service';
import { Permission } from '../src/resources/role/enums/permission.enum';
import { createE2eApp } from './support/e2e-app';

const MATCH_ID = '00000000-0000-4000-8000-0000000000d1';
const CATEGORY_ID = '00000000-0000-4000-8000-000000000005';
const TEAM_A = '00000000-0000-4000-8000-0000000000a1';
const TEAM_B = '00000000-0000-4000-8000-0000000000b2';
const MATCHES_PATH = `/categories/${CATEGORY_ID}/matches`;

const users: Record<string, AuthenticatedUser> = {
  'organizer-token': {
    id: '00000000-0000-4000-8000-000000000001',
    name: 'Organizer',
    email: 'organizer@example.com',
    permissions: [Permission.MATCH_CREATE],
  },
  'scorer-token': {
    id: '00000000-0000-4000-8000-000000000002',
    name: 'Scorer',
    email: 'scorer@example.com',
    permissions: [Permission.MATCH_RECORD_SCORE],
  },
};

const match = {
  id: MATCH_ID,
  categoryId: CATEGORY_ID,
  stage: MatchStage.KNOCKOUT,
  groupId: null,
  round: MatchRound.FINAL,
  scheduledAt: new Date('2026-12-19T22:00:00.000Z'),
  location: null,
  status: MatchStatus.SCHEDULED,
  teamAId: TEAM_A,
  teamBId: TEAM_B,
  resultType: 'PLAYED',
  scoreA: null,
  scoreB: null,
  penaltiesA: null,
  penaltiesB: null,
  winnerId: null,
  finalizedById: null,
  finalizedAt: null,
  bestPlayerName: null,
  bestPlayerPhotoKey: null,
  bestPlayerTeamId: null,
};

const validMatch = {
  stage: 'KNOCKOUT',
  round: 'FINAL',
  scheduledAt: '2026-12-19T19:00:00-03:00',
  teamAId: TEAM_A,
  teamBId: TEAM_B,
};

const matchService = {
  listByCategory: jest.fn(),
  findByIdOrFail: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};
const resultService = { record: jest.fn() };

function createApp(): Promise<INestApplication> {
  return createE2eApp(
    [MatchController],
    [
      { provide: MatchService, useValue: matchService },
      { provide: MatchResultService, useValue: resultService },
    ],
    users,
  );
}

describe('Matches (e2e)', () => {
  let app: INestApplication;
  const server = (): App => app.getHttpServer() as App;
  const as = (token: string, call: request.Test): request.Test =>
    call.set('Authorization', `Bearer ${token}`);

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    matchService.listByCategory.mockResolvedValue([match]);
    matchService.findByIdOrFail.mockResolvedValue(match);
    matchService.create.mockResolvedValue(match);
    matchService.update.mockResolvedValue(match);
    matchService.remove.mockResolvedValue(undefined);
    resultService.record.mockResolvedValue(match);
  });

  it('lets a visitor list the matches and read one', async () => {
    const list = await request(server()).get(MATCHES_PATH);
    const one = await request(server()).get(`/matches/${MATCH_ID}`);

    expect(list.body).toMatchObject({ count: 1, results: [{ id: MATCH_ID }] });
    expect(one.body).toMatchObject({ status: 'success', result: { id: MATCH_ID } });
    expect(one.body).not.toHaveProperty('result.finalizedById');
  });

  it('passes the match filters of the query string to the service', async () => {
    await request(server()).get(
      `${MATCHES_PATH}?stage=KNOCKOUT&status=FINALIZED&teamId=${TEAM_A}&scheduledFrom=2026-12-09T00:00:00Z`,
    );

    expect(matchService.listByCategory).toHaveBeenCalledWith(
      CATEGORY_ID,
      expect.objectContaining({
        stage: 'KNOCKOUT',
        status: 'FINALIZED',
        teamId: TEAM_A,
        scheduledFrom: '2026-12-09T00:00:00Z',
      }),
    );
  });

  it.each(['stage=SEMI', 'status=DONE', 'teamId=abc', 'scheduledFrom=yesterday', 'limit=0'])(
    'rejects the invalid filter %s',
    async (query) => {
      const response = await request(server()).get(`${MATCHES_PATH}?${query}`);

      expect(response.status).toBe(400);
    },
  );

  it('requires login, then the match permission, to create a match', async () => {
    const anonymous = await request(server()).post(MATCHES_PATH).send(validMatch);
    const scorer = await as('scorer-token', request(server()).post(MATCHES_PATH).send(validMatch));

    expect(anonymous.status).toBe(401);
    expect(scorer.status).toBe(403);
  });

  it('creates a match with a valid body', async () => {
    const response = await as(
      'organizer-token',
      request(server()).post(MATCHES_PATH).send(validMatch),
    );

    expect(response.status).toBe(201);
    expect(matchService.create).toHaveBeenCalledWith(CATEGORY_ID, validMatch);
  });

  it.each([
    { scenario: 'the stage is unknown', body: { ...validMatch, stage: 'LEAGUE' }, field: 'stage' },
    {
      scenario: 'the date is not a date',
      body: { ...validMatch, scheduledAt: '19/12' },
      field: 'scheduledAt',
    },
    {
      scenario: 'a team id is not a uuid',
      body: { ...validMatch, teamAId: '1' },
      field: 'teamAId',
    },
    { scenario: 'the round is unknown', body: { ...validMatch, round: 'EIGHTH' }, field: 'round' },
  ])('rejects a match when $scenario', async ({ body, field }) => {
    const response = await as('organizer-token', request(server()).post(MATCHES_PATH).send(body));

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ errors: { field } });
  });

  it('changes only the schedule, location and teams of a match', async () => {
    const allowed = await as(
      'organizer-token',
      request(server()).patch(`/matches/${MATCH_ID}`).send({ location: 'Ginásio' }),
    );
    const forbiddenField = await as(
      'organizer-token',
      request(server()).patch(`/matches/${MATCH_ID}`).send({ stage: 'GROUP' }),
    );

    expect(allowed.status).toBe(200);
    expect(forbiddenField.status).toBe(400);
    expect(forbiddenField.body).toMatchObject({ errors: { field: 'stage' } });
  });

  it('removes a match with no content in the response', async () => {
    const response = await as('organizer-token', request(server()).delete(`/matches/${MATCH_ID}`));

    expect(response.status).toBe(204);
    expect(matchService.remove).toHaveBeenCalledWith(MATCH_ID);
  });
});
