import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types';
import type { AuthenticatedUser } from '../src/resources/auth/dto/authenticated-user.dto';
import { MatchController } from '../src/resources/match/controllers/match.controller';
import { MatchSuggestionController } from '../src/resources/match/controllers/match-suggestion.controller';
import { MatchRound, MatchStage } from '../src/resources/match/enums/match.enums';
import { BracketSuggestionService } from '../src/resources/match/services/bracket-suggestion.service';
import { GroupFixtureSuggestionService } from '../src/resources/match/services/group-fixture-suggestion.service';
import { MatchBatchService } from '../src/resources/match/services/match-batch.service';
import { MatchResultService } from '../src/resources/match/services/match-result.service';
import { MatchService } from '../src/resources/match/services/match.service';
import { Permission } from '../src/resources/role/enums/permission.enum';
import { createE2eApp } from './support/e2e-app';

const CATEGORY_ID = '00000000-0000-4000-8000-000000000005';
const SUGGESTION_PATH = `/categories/${CATEGORY_ID}/bracket/suggestion`;
const BATCH_PATH = `/categories/${CATEGORY_ID}/matches/batch`;
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

const validBatch = {
  matches: [
    {
      stage: MatchStage.KNOCKOUT,
      round: MatchRound.FINAL,
      bracketPosition: 0,
      teamAId: TEAM_A,
      teamBId: TEAM_B,
      scheduledAt: '2026-12-19T19:00:00-03:00',
    },
  ],
};

const bracketSuggestions = { suggestFirstRound: jest.fn(), suggestNextMatches: jest.fn() };
const groupFixtureSuggestions = { suggest: jest.fn() };
const batchService = { createMany: jest.fn() };

describe('Suggested fixtures and bracket (e2e)', () => {
  let app: INestApplication;
  const server = (): App => app.getHttpServer() as App;
  const as = (token: string, call: request.Test): request.Test =>
    call.set('Authorization', `Bearer ${token}`);

  beforeAll(async () => {
    app = await createE2eApp(
      [MatchSuggestionController, MatchController],
      [
        { provide: BracketSuggestionService, useValue: bracketSuggestions },
        { provide: GroupFixtureSuggestionService, useValue: groupFixtureSuggestions },
        { provide: MatchBatchService, useValue: batchService },
        { provide: MatchService, useValue: {} },
        { provide: MatchResultService, useValue: {} },
      ],
      users,
    );
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    bracketSuggestions.suggestFirstRound.mockResolvedValue([]);
    batchService.createMany.mockResolvedValue([]);
  });

  it('requires login, then the match permission, to ask for a suggestion', async () => {
    const body = { teamIds: [TEAM_A, TEAM_B] };
    const anonymous = await request(server()).post(SUGGESTION_PATH).send(body);
    const scorer = await as('scorer-token', request(server()).post(SUGGESTION_PATH).send(body));

    expect(anonymous.status).toBe(401);
    expect(scorer.status).toBe(403);
  });

  it('rejects a suggestion request with fewer than two teams', async () => {
    const response = await as(
      'organizer-token',
      request(server())
        .post(SUGGESTION_PATH)
        .send({ teamIds: [TEAM_A] }),
    );

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ errors: { field: 'teamIds' } });
  });

  it('answers a valid suggestion request without creating anything', async () => {
    const response = await as(
      'organizer-token',
      request(server())
        .post(SUGGESTION_PATH)
        .send({ teamIds: [TEAM_A, TEAM_B] }),
    );

    expect(response.status).toBe(201);
    expect(batchService.createMany).not.toHaveBeenCalled();
  });

  it('requires the match permission to create the confirmed matches', async () => {
    const scorer = await as('scorer-token', request(server()).post(BATCH_PATH).send(validBatch));

    expect(scorer.status).toBe(403);
  });

  it('creates the confirmed matches', async () => {
    const response = await as(
      'organizer-token',
      request(server()).post(BATCH_PATH).send(validBatch),
    );

    expect(response.status).toBe(201);
    expect(batchService.createMany).toHaveBeenCalledWith(CATEGORY_ID, validBatch);
  });

  it.each([
    { scenario: 'there is no match', body: { matches: [] }, field: 'matches' },
    {
      scenario: 'a nested match has an invalid team',
      body: { matches: [{ ...validBatch.matches[0], teamAId: '1' }] },
      field: 'matches.0.teamAId',
    },
    {
      scenario: 'the bracket position is out of range',
      body: { matches: [{ ...validBatch.matches[0], bracketPosition: 99 }] },
      field: 'matches.0.bracketPosition',
    },
  ])('rejects the batch when $scenario', async ({ body, field }) => {
    const response = await as('organizer-token', request(server()).post(BATCH_PATH).send(body));

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ errors: { field } });
  });
});
