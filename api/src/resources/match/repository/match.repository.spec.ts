import { Between, LessThanOrEqual, MoreThanOrEqual, type Repository } from 'typeorm';
import type { Match } from '../entities/match.entity';
import { MatchResultType, MatchRound, MatchStage, MatchStatus } from '../enums/match.enums';
import { MatchRepository } from './match.repository';

type TypeOrmMock = Record<
  'find' | 'findOneBy' | 'create' | 'save' | 'update' | 'delete',
  jest.Mock
>;

const MATCH_ID = '00000000-0000-4000-8000-0000000000d1';
const CATEGORY_ID = '00000000-0000-4000-8000-000000000005';
const TEAM_ID = '00000000-0000-4000-8000-0000000000a1';
const ORDER = { scheduledAt: 'ASC', id: 'ASC' };

function createFixture(): { repository: MatchRepository; typeorm: TypeOrmMock } {
  const typeorm: TypeOrmMock = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn((entity: Partial<Match>) => entity),
    save: jest.fn((entity: Partial<Match>) => Promise.resolve(entity)),
    update: jest.fn(),
    delete: jest.fn(),
  };
  return { repository: new MatchRepository(typeorm as unknown as Repository<Match>), typeorm };
}

describe('MatchRepository.findByCategory', () => {
  it('filters by stage, group, round and status', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findByCategory(CATEGORY_ID, {
      stage: MatchStage.KNOCKOUT,
      round: MatchRound.FINAL,
      status: MatchStatus.FINALIZED,
    });

    expect(typeorm.find).toHaveBeenCalledWith({
      where: [
        {
          categoryId: CATEGORY_ID,
          stage: MatchStage.KNOCKOUT,
          round: MatchRound.FINAL,
          status: MatchStatus.FINALIZED,
        },
      ],
      order: ORDER,
    });
  });

  it('matches a team on either side of the match', async () => {
    const { repository, typeorm } = createFixture();

    await repository.findByCategory(CATEGORY_ID, { teamId: TEAM_ID });

    expect(typeorm.find).toHaveBeenCalledWith({
      where: [
        { categoryId: CATEGORY_ID, teamAId: TEAM_ID },
        { categoryId: CATEGORY_ID, teamBId: TEAM_ID },
      ],
      order: ORDER,
    });
  });

  it.each([
    {
      scenario: 'a closed interval',
      filters: { scheduledFrom: '2026-12-09T00:00:00Z', scheduledTo: '2026-12-10T00:00:00Z' },
      expected: Between(new Date('2026-12-09T00:00:00Z'), new Date('2026-12-10T00:00:00Z')),
    },
    {
      scenario: 'only a start',
      filters: { scheduledFrom: '2026-12-09T00:00:00Z' },
      expected: MoreThanOrEqual(new Date('2026-12-09T00:00:00Z')),
    },
    {
      scenario: 'only an end',
      filters: { scheduledTo: '2026-12-10T00:00:00Z' },
      expected: LessThanOrEqual(new Date('2026-12-10T00:00:00Z')),
    },
  ])('filters by $scenario of dates', async ({ filters, expected }) => {
    const { repository, typeorm } = createFixture();

    await repository.findByCategory(CATEGORY_ID, filters);

    expect(typeorm.find).toHaveBeenCalledWith({
      where: [{ categoryId: CATEGORY_ID, scheduledAt: expected }],
      order: ORDER,
    });
  });
});

describe('MatchRepository', () => {
  it('saves a new match as scheduled', async () => {
    const { repository } = createFixture();
    const record = {
      categoryId: CATEGORY_ID,
      stage: MatchStage.KNOCKOUT,
      groupId: null,
      round: MatchRound.FINAL,
      bracketPosition: 0,
      scheduledAt: new Date('2026-12-19T22:00:00Z'),
      location: null,
      teamAId: TEAM_ID,
      teamBId: MATCH_ID,
    };

    await expect(repository.create(record)).resolves.toEqual({
      ...record,
      status: MatchStatus.SCHEDULED,
    });
  });

  it('saves a result and marks the match as finalized', async () => {
    const { repository, typeorm } = createFixture();
    const result = {
      resultType: MatchResultType.PLAYED,
      scoreA: 1,
      scoreB: 0,
      penaltiesA: null,
      penaltiesB: null,
      winnerId: TEAM_ID,
      finalizedById: CATEGORY_ID,
      finalizedAt: new Date('2026-12-09T23:00:00Z'),
      bestPlayerName: null,
      bestPlayerPhotoKey: null,
      bestPlayerTeamId: null,
    };

    await repository.saveResult(MATCH_ID, result);

    expect(typeorm.update).toHaveBeenCalledWith(
      { id: MATCH_ID },
      { ...result, status: MatchStatus.FINALIZED },
    );
  });
});
