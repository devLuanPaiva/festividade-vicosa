import { describe, expect, it } from 'vitest';
import type { MatchListItem, MatchStatus } from '@/features/games/types';
import { splitAdminMatches } from './split-admin-matches';

function matchAt(id: string, scheduledAt: string, status: MatchStatus): MatchListItem {
  return { id, scheduledAt, status } as MatchListItem;
}

function idsOf(matches: MatchListItem[]): string[] {
  return matches.map((match) => match.id);
}

const NOW = new Date('2026-12-10T15:00:00Z');

describe('splitAdminMatches', () => {
  it('uses the festival day in Fortaleza, not the UTC day', () => {
    const lateNight = matchAt('late', '2026-12-11T01:30:00Z', 'SCHEDULED');
    const nextMorning = matchAt('next', '2026-12-11T12:00:00Z', 'SCHEDULED');

    const groups = splitAdminMatches([lateNight, nextMorning], NOW);

    expect(idsOf(groups.today)).toEqual(['late']);
    expect(idsOf(groups.upcoming)).toEqual(['next']);
  });

  it('flags unfinalized matches from previous days as overdue', () => {
    const forgotten = matchAt('forgotten', '2026-12-09T18:00:00Z', 'SCHEDULED');
    const done = matchAt('done', '2026-12-09T20:00:00Z', 'FINALIZED');

    const groups = splitAdminMatches([forgotten, done], NOW);

    expect(idsOf(groups.overdue)).toEqual(['forgotten']);
    expect(idsOf(groups.recentlyFinalized)).toEqual(['done']);
  });

  it('keeps today matches whatever their status so they can still be corrected', () => {
    const finalizedToday = matchAt('finalized', '2026-12-10T13:00:00Z', 'FINALIZED');

    expect(idsOf(splitAdminMatches([finalizedToday], NOW).today)).toEqual(['finalized']);
  });

  it('lists the most recent finalized matches first and caps the lists', () => {
    const finalized = Array.from({ length: 10 }, (_, index) =>
      matchAt(`f${index}`, `2026-12-0${index + 1 > 9 ? 9 : index + 1}T18:00:00Z`, 'FINALIZED'),
    );
    const upcoming = Array.from({ length: 12 }, (_, index) =>
      matchAt(`u${index}`, '2026-12-20T18:00:00Z', 'SCHEDULED'),
    );

    const groups = splitAdminMatches([...finalized, ...upcoming], NOW);

    expect(groups.recentlyFinalized).toHaveLength(8);
    expect(groups.recentlyFinalized[0]?.id).toBe('f9');
    expect(groups.upcoming).toHaveLength(8);
  });
});
