import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types';
import type { AuthenticatedUser } from '../src/resources/auth/dto/authenticated-user.dto';
import { MatchBracketController } from '../src/resources/match/controllers/match-bracket.controller';
import {
  MatchResultType,
  MatchRound,
  MatchStage,
  MatchStatus,
} from '../src/resources/match/enums/match.enums';
import { MatchBracketGenerator } from '../src/resources/match/services/match-bracket-generator.service';
import { Permission } from '../src/resources/role/enums/permission.enum';
import { createE2eApp } from './support/e2e-app';

const CATEGORY_ID = '00000000-0000-4000-8000-000000000005';
const BRACKET_PATH = `/categories/${CATEGORY_ID}/bracket`;
const TEAM_A = '00000000-0000-4000-8000-0000000000a1';
const TEAM_B = '00000000-0000-4000-8000-0000000000b2';

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
  id: '00000000-0000-4000-8000-0000000000d1',
  categoryId: CATEGORY_ID,
  stage: MatchStage.KNOCKOUT,
  groupId: null,
  round: MatchRound.FINAL,
  bracketPosition: 0,
  scheduledAt: new Date('2026-12-19T22:00:00.000Z'),
  location: null,
  status: MatchStatus.SCHEDULED,
  teamAId: TEAM_A,
  teamBId: TEAM_B,
  resultType: MatchResultType.PLAYED,
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

const validBracket = {
  teamIds: [TEAM_A, TEAM_B],
  scheduledAt: '2026-12-19T19:00:00-03:00',
};

const bracketGenerator = { generate: jest.fn() };

describe('Bracket (e2e)', () => {
  let app: INestApplication;
  const server = (): App => app.getHttpServer() as App;
  const as = (token: string, call: request.Test): request.Test =>
    call.set('Authorization', `Bearer ${token}`);

  beforeAll(async () => {
    app = await createE2eApp(
      [MatchBracketController],
      [{ provide: MatchBracketGenerator, useValue: bracketGenerator }],
      users,
    );
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    bracketGenerator.generate.mockResolvedValue([match]);
  });

  it('requires login, then the match permission, to generate the bracket', async () => {
    const anonymous = await request(server()).post(BRACKET_PATH).send(validBracket);
    const scorer = await as(
      'scorer-token',
      request(server()).post(BRACKET_PATH).send(validBracket),
    );

    expect(anonymous.status).toBe(401);
    expect(scorer.status).toBe(403);
  });

  it('generates the bracket and answers with the created matches', async () => {
    const response = await as(
      'organizer-token',
      request(server()).post(BRACKET_PATH).send(validBracket),
    );

    expect(response.status).toBe(201);
    expect(bracketGenerator.generate).toHaveBeenCalledWith(CATEGORY_ID, validBracket);
    expect(response.body).toMatchObject({ results: [{ round: 'FINAL', bracketPosition: 0 }] });
  });

  it.each([
    { scenario: 'there is only one team', body: { ...validBracket, teamIds: [TEAM_A] } },
    { scenario: 'a team id is not a uuid', body: { ...validBracket, teamIds: [TEAM_A, '1'] } },
  ])('rejects the bracket when $scenario', async ({ body }) => {
    const response = await as('organizer-token', request(server()).post(BRACKET_PATH).send(body));

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ errors: { field: 'teamIds' } });
  });
});
