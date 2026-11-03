import type {
  CategoryProgressRow,
  IndicatorRepository,
  MatchTotalsRow,
} from '../repository/indicator.repository';
import { IndicatorService } from './indicator.service';

const TOTALS: MatchTotalsRow = {
  categories: 11,
  teams: 88,
  total: 142,
  scheduled: 51,
  finalized: 91,
  today: 6,
  overdue: 2,
  walkovers: 3,
  goals: 1000,
  playedMatches: 88,
};

function createService(repository: Partial<IndicatorRepository>): IndicatorService {
  return new IndicatorService(repository as IndicatorRepository);
}

describe('IndicatorService.getOverview', () => {
  it('derives the completion rate and the goals per played match', async () => {
    const findMatchTotals = jest.fn().mockResolvedValue(TOTALS);

    const overview = await createService({ findMatchTotals }).getOverview(
      new Date('2026-12-04T15:00:00.000Z'),
    );

    expect(overview.matches.completionRate).toBe(64);
    expect(overview.goals).toEqual({ total: 1000, perMatch: 11.36 });
  });

  it('asks for the day that is current in Fortaleza, not in UTC', async () => {
    const findMatchTotals = jest.fn().mockResolvedValue(TOTALS);

    await createService({ findMatchTotals }).getOverview(new Date('2026-12-05T02:00:00.000Z'));

    const [, today] = findMatchTotals.mock.calls[0] as [Date, { start: Date; end: Date }];
    expect(today.start.toISOString()).toBe('2026-12-04T03:00:00.000Z');
    expect(today.end.toISOString()).toBe('2026-12-05T03:00:00.000Z');
  });

  it('reports zero rates before any match exists', async () => {
    const empty = { ...TOTALS, total: 0, finalized: 0, goals: 0, playedMatches: 0 };
    const findMatchTotals = jest.fn().mockResolvedValue(empty);

    const overview = await createService({ findMatchTotals }).getOverview();

    expect(overview.matches.completionRate).toBe(0);
    expect(overview.goals.perMatch).toBe(0);
  });
});

describe('IndicatorService.listCategoryProgress', () => {
  it('adds the completion rate and the average without leaking the played count', async () => {
    const row: CategoryProgressRow = {
      categoryId: 'c1',
      name: 'Adulto',
      gender: 'MALE',
      subEventName: 'JOCEV - Futsal',
      teams: 8,
      matches: 12,
      finalized: 3,
      goals: 20,
      playedMatches: 3,
    };
    const findCategoryProgress = jest.fn().mockResolvedValue([row]);

    const [progress] = await createService({ findCategoryProgress }).listCategoryProgress();

    expect(progress).toMatchObject({ completionRate: 25, goalsPerMatch: 6.67 });
    expect(progress).not.toHaveProperty('playedMatches');
  });
});
