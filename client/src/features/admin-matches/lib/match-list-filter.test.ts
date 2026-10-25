import { describe, expect, it } from 'vitest';
import type { MatchListItem } from '@/features/games/types';
import { countByStatus, filterByScope, filterByStatus, sortByDate } from './match-list-filter';
import { DEFAULT_MATCH_LIST_QUERY, type MatchListQuery } from './match-list-query';

const NOW = new Date('2026-12-04T15:00:00.000Z');

function matchOf(id: string, overrides: Partial<MatchListItem> = {}): MatchListItem {
  return {
    id,
    categoryId: 'c1',
    stage: 'GROUP',
    status: 'SCHEDULED',
    scheduledAt: '2026-12-05T11:00:00.000Z',
    location: null,
    teamA: { name: 'Santa Luzia' },
    teamB: { name: 'São José' },
    category: { name: 'Adulto', gender: 'MALE' },
    ...overrides,
  } as MatchListItem;
}

const MATCHES = [
  matchOf('today-open', { scheduledAt: '2026-12-04T18:00:00.000Z' }),
  matchOf('overdue', { scheduledAt: '2026-12-04T11:00:00.000Z' }),
  matchOf('done', { status: 'FINALIZED', scheduledAt: '2026-12-03T11:00:00.000Z' }),
  matchOf('later', { categoryId: 'c2', stage: 'KNOCKOUT', location: 'Ginásio Municipal' }),
];

function ids(matches: MatchListItem[]): string[] {
  return matches.map((match) => match.id);
}

function query(changes: Partial<MatchListQuery>): MatchListQuery {
  return { ...DEFAULT_MATCH_LIST_QUERY, ...changes };
}

describe('filterByStatus', () => {
  it('splits the day by the local calendar, not by UTC', () => {
    expect(ids(filterByStatus(MATCHES, 'hoje', NOW))).toEqual(['today-open', 'overdue']);
  });

  it('calls overdue only the matches that are still scheduled and already past their time', () => {
    expect(ids(filterByStatus(MATCHES, 'atrasadas', NOW))).toEqual(['overdue']);
  });

  it('keeps finalized and scheduled matches apart', () => {
    expect(ids(filterByStatus(MATCHES, 'finalizadas', NOW))).toEqual(['done']);
    expect(ids(filterByStatus(MATCHES, 'agendadas', NOW))).toEqual([
      'today-open',
      'overdue',
      'later',
    ]);
  });
});

describe('countByStatus', () => {
  it('counts every status so the counters double as filters', () => {
    expect(countByStatus(MATCHES, NOW)).toEqual({
      todas: 4,
      hoje: 2,
      atrasadas: 1,
      agendadas: 3,
      finalizadas: 1,
    });
  });
});

describe('filterByScope', () => {
  it('searches teams, category and place without caring about accents or case', () => {
    expect(filterByScope(MATCHES, query({ search: 'sao jose' }))).toHaveLength(4);
    expect(ids(filterByScope(MATCHES, query({ search: 'GINASIO' })))).toEqual(['later']);
    expect(filterByScope(MATCHES, query({ search: 'adulto masculino' }))).toHaveLength(4);
    expect(filterByScope(MATCHES, query({ search: 'inexistente' }))).toEqual([]);
  });

  it('narrows by category, stage and local day together', () => {
    expect(ids(filterByScope(MATCHES, query({ categoryId: 'c2' })))).toEqual(['later']);
    expect(ids(filterByScope(MATCHES, query({ stage: 'mata-mata' })))).toEqual(['later']);
    expect(ids(filterByScope(MATCHES, query({ day: '2026-12-04' })))).toEqual([
      'today-open',
      'overdue',
    ]);
  });
});

describe('sortByDate', () => {
  it('orders by date without touching the original list', () => {
    expect(ids(sortByDate(MATCHES, 'asc'))).toEqual(['done', 'overdue', 'today-open', 'later']);
    expect(ids(sortByDate(MATCHES, 'desc'))).toEqual(['later', 'today-open', 'overdue', 'done']);
    expect(ids(MATCHES)).toEqual(['today-open', 'overdue', 'done', 'later']);
  });
});
