import { describe, expect, it } from 'vitest';
import type { MatchListItem } from '@/features/games/types';
import { buildMatchListData } from './match-list-data';
import { DEFAULT_MATCH_LIST_QUERY } from './match-list-query';

const NOW = new Date('2026-12-04T15:00:00.000Z');

function matchOf(index: number, overrides: Partial<MatchListItem> = {}): MatchListItem {
  const day = String(5 + Math.floor(index / 10)).padStart(2, '0');
  const hour = String(11 + (index % 10)).padStart(2, '0');
  return {
    id: `m${index}`,
    categoryId: 'c1',
    stage: 'GROUP',
    round: null,
    status: 'SCHEDULED',
    scheduledAt: `2026-12-${day}T${hour}:00:00.000Z`,
    location: null,
    teamA: { name: index % 2 === 0 ? 'Santa Luzia' : 'Estrela da Serra' },
    teamB: { name: 'São José' },
    category: { name: 'Adulto', gender: 'MALE' },
    ...overrides,
  } as MatchListItem;
}

const MATCHES = Array.from({ length: 45 }, (_, index) => matchOf(index));

describe('buildMatchListData', () => {
  it('shows the first page of twenty, in date order, and the totals of the whole list', () => {
    const { page, counts } = buildMatchListData(MATCHES, DEFAULT_MATCH_LIST_QUERY, NOW);

    expect(page.items).toHaveLength(20);
    expect(page.items[0]?.id).toBe('m0');
    expect(page).toMatchObject({ page: 1, totalPages: 3, total: 45 });
    expect(counts.todas).toBe(45);
  });

  it('keeps the status counters tied to the search, not to the status already chosen', () => {
    const query = {
      ...DEFAULT_MATCH_LIST_QUERY,
      search: 'estrela',
      status: 'finalizadas' as const,
    };
    const finalized = MATCHES.map((match, index) =>
      index === 1 ? { ...match, status: 'FINALIZED' as const } : match,
    );

    const { page, counts } = buildMatchListData(finalized, query, NOW);

    expect(page.items.map((row) => row.id)).toEqual(['m1']);
    expect(counts).toMatchObject({ todas: 22, finalizadas: 1, agendadas: 21 });
  });

  it('goes to the last page that exists when the address asks for one beyond it', () => {
    const query = { ...DEFAULT_MATCH_LIST_QUERY, page: 50 };

    expect(buildMatchListData(MATCHES, query, NOW).page).toMatchObject({ page: 3 });
  });

  it('turns only the visible page into rows', () => {
    const query = { ...DEFAULT_MATCH_LIST_QUERY, order: 'desc' as const, page: 3 };

    const { page } = buildMatchListData(MATCHES, query, NOW);

    expect(page.items).toHaveLength(5);
    expect(page.items[0]?.teamB).toBe('São José');
  });
});
