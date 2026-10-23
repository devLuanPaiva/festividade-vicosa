import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types';
import { StandingController } from '../src/resources/standing/controllers/standing.controller';
import { StandingService } from '../src/resources/standing/services/standing.service';
import { createE2eApp } from './support/e2e-app';

const CATEGORY_ID = '00000000-0000-4000-8000-000000000005';
const GROUP_ID = '00000000-0000-4000-8000-000000000001';

const row = {
  position: 1,
  teamId: '00000000-0000-4000-8000-0000000000a1',
  teamName: 'Alfa',
  played: 1,
  wins: 1,
  draws: 0,
  losses: 0,
  goalsFor: 2,
  goalsAgainst: 0,
  goalDifference: 2,
  points: 3,
};

const standingService = {
  listByCategory: jest.fn(),
  getByGroup: jest.fn(),
  listSeeding: jest.fn(),
};

describe('Standings (e2e)', () => {
  let app: INestApplication;
  const server = (): App => app.getHttpServer() as App;

  beforeAll(async () => {
    app = await createE2eApp(
      [StandingController],
      [{ provide: StandingService, useValue: standingService }],
      {},
    );
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    standingService.listByCategory.mockResolvedValue([
      { groupId: GROUP_ID, groupName: 'Grupo A', rows: [row] },
    ]);
    standingService.getByGroup.mockResolvedValue([row]);
    standingService.listSeeding.mockResolvedValue([
      { seed: 1, teamId: row.teamId, teamName: 'Alfa', groupId: GROUP_ID, groupName: 'Grupo A' },
    ]);
  });

  it('lets a visitor read the seeding built from the confirmed qualified teams', async () => {
    const response = await request(server()).get(`/categories/${CATEGORY_ID}/seeding`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ count: 1, results: [{ seed: 1, teamName: 'Alfa' }] });
    expect(standingService.listSeeding).toHaveBeenCalledWith(CATEGORY_ID);
  });

  it('lets a visitor read the standings of every group of a category', async () => {
    const response = await request(server()).get(`/categories/${CATEGORY_ID}/standings`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      count: 1,
      results: [{ groupName: 'Grupo A', rows: [{ teamName: 'Alfa', points: 3 }] }],
    });
  });

  it('lets a visitor read the standings of one group', async () => {
    const response = await request(server()).get(`/groups/${GROUP_ID}/standings`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ results: [row] });
  });

  it('rejects an id that is not a uuid', async () => {
    const response = await request(server()).get('/groups/1/standings');

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ errors: { code: 'INVALID_ID', field: 'id' } });
  });
});
