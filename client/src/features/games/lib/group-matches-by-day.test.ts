import { describe, expect, it } from 'vitest';
import type { MatchListItem } from '../types';
import { groupMatchesByDay } from './group-matches-by-day';

function matchAt(id: string, scheduledAt: string): MatchListItem {
  return { id, scheduledAt } as MatchListItem;
}

describe('groupMatchesByDay', () => {
  it('keeps the order and groups the matches of the same local day', () => {
    const days = groupMatchesByDay([
      matchAt('a', '2026-12-09T11:00:00.000Z'),
      matchAt('b', '2026-12-09T20:00:00.000Z'),
      matchAt('c', '2026-12-10T11:00:00.000Z'),
    ]);

    expect(days.map((day) => day.matches.map((match) => match.id))).toEqual([['a', 'b'], ['c']]);
  });

  it('uses the local time of Viçosa, so a night game does not slip into the next day', () => {
    const days = groupMatchesByDay([
      matchAt('late', '2026-12-10T01:30:00.000Z'),
      matchAt('early', '2026-12-10T11:00:00.000Z'),
    ]);

    expect(days.map((day) => day.key)).toEqual(['2026-12-09', '2026-12-10']);
    expect(days[0]?.heading).toBe('quarta-feira, 9 de dezembro');
  });

  it('returns no days when there are no matches', () => {
    expect(groupMatchesByDay([])).toEqual([]);
  });
});
