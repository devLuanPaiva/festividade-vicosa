import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types';
import type { AuthenticatedUser } from '../src/resources/auth/dto/authenticated-user.dto';
import { MatchController } from '../src/resources/match/controllers/match.controller';
import { MatchResultService } from '../src/resources/match/services/match-result.service';
import { MatchService } from '../src/resources/match/services/match.service';
import { Permission } from '../src/resources/role/enums/permission.enum';
import { createE2eApp } from './support/e2e-app';

const MATCH_ID = '00000000-0000-4000-8000-0000000000d1';
const TEAM_A = '00000000-0000-4000-8000-0000000000a1';

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

const resultService = { record: jest.fn() };

describe('Match results (e2e)', () => {
  let app: INestApplication;
  const server = (): App => app.getHttpServer() as App;
  const as = (token: string, call: request.Test): request.Test =>
    call.set('Authorization', `Bearer ${token}`);

  beforeAll(async () => {
    app = await createE2eApp(
      [MatchController],
      [
        { provide: MatchService, useValue: {} },
        { provide: MatchResultService, useValue: resultService },
      ],
      users,
    );
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    resultService.record.mockResolvedValue({
      id: MATCH_ID,
      scheduledAt: new Date('2026-12-19T22:00:00.000Z'),
    });
  });

  it('records a result as the logged user with the score permission', async () => {
    const body = {
      scoreA: 2,
      scoreB: 2,
      penaltiesA: 4,
      penaltiesB: 3,
      bestPlayerName: 'Ana',
      bestPlayerTeamId: TEAM_A,
    };

    const response = await as(
      'scorer-token',
      request(server()).put(`/matches/${MATCH_ID}/result`).send(body),
    );

    expect(response.status).toBe(200);
    expect(resultService.record).toHaveBeenCalledWith(MATCH_ID, users['scorer-token']?.id, body);
  });

  it('records a walkover with the team that showed up', async () => {
    const body = { resultType: 'WALKOVER', walkoverWinnerId: TEAM_A };

    const response = await as(
      'scorer-token',
      request(server()).put(`/matches/${MATCH_ID}/result`).send(body),
    );

    expect(response.status).toBe(200);
    expect(resultService.record).toHaveBeenCalledWith(MATCH_ID, users['scorer-token']?.id, body);
  });

  it.each([
    { scenario: 'an unknown result type', body: { resultType: 'FORFEIT' }, field: 'resultType' },
    {
      scenario: 'a walkover winner that is not a uuid',
      body: { resultType: 'WALKOVER', walkoverWinnerId: '3' },
      field: 'walkoverWinnerId',
    },
  ])('rejects a result with $scenario', async ({ body, field }) => {
    const response = await as(
      'scorer-token',
      request(server()).put(`/matches/${MATCH_ID}/result`).send(body),
    );

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ errors: { field } });
  });

  it('does not let the organizer without the score permission record a result', async () => {
    const response = await as(
      'organizer-token',
      request(server()).put(`/matches/${MATCH_ID}/result`).send({ scoreA: 1, scoreB: 0 }),
    );

    expect(response.status).toBe(403);
  });

  it.each([
    { scenario: 'a negative score', body: { scoreA: -1, scoreB: 0 }, field: 'scoreA' },
    { scenario: 'a score with decimals', body: { scoreA: 1.5, scoreB: 0 }, field: 'scoreA' },
    {
      scenario: 'penalties that are not numbers',
      body: { scoreA: 1, scoreB: 1, penaltiesA: 'x' },
      field: 'penaltiesA',
    },
    {
      scenario: 'a best player team that is not a uuid',
      body: { scoreA: 1, scoreB: 0, bestPlayerTeamId: '7' },
      field: 'bestPlayerTeamId',
    },
  ])('rejects a result with $scenario', async ({ body, field }) => {
    const response = await as(
      'scorer-token',
      request(server()).put(`/matches/${MATCH_ID}/result`).send(body),
    );

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ errors: { field } });
  });
});
