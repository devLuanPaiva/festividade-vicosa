import { describe, expect, it } from 'vitest';
import type { MatchGroup } from '@/features/admin-teams/types';
import type { Match, Team } from '@/features/games/types';
import { buildCategoryMatchDays } from './category-match-days';

const TEAMS = [
  { id: 't1', name: 'Viçosa' },
  { id: 't2', name: 'Pau dos Ferros' },
] as Team[];
const GROUPS: MatchGroup[] = [{ id: 'g1', categoryId: 'c', name: 'A' }];

function matchAt(id: string, scheduledAt: string, overrides: Partial<Match> = {}): Match {
  return {
    id,
    stage: 'GROUP',
    groupId: 'g1',
    round: null,
    scheduledAt,
    status: 'SCHEDULED',
    teamAId: 't1',
    teamBId: 't2',
    ...overrides,
  } as Match;
}

function idsByDay(days: ReturnType<typeof buildCategoryMatchDays>): string[][] {
  return days.map((day) => day.rows.map((row) => row.id));
}

describe('buildCategoryMatchDays', () => {
  it('groups the matches by the local day and keeps the API order', () => {
    const days = buildCategoryMatchDays(
      [
        matchAt('m1', '2026-12-18T18:00:00.000Z'),
        matchAt('m2', '2026-12-18T20:00:00.000Z'),
        matchAt('m3', '2026-12-19T02:30:00.000Z'),
      ],
      TEAMS,
      GROUPS,
    );

    expect(idsByDay(days)).toEqual([['m1', 'm2', 'm3']]);
  });

  it('splits the days at local midnight, not at UTC midnight', () => {
    const days = buildCategoryMatchDays(
      [matchAt('m1', '2026-12-19T02:30:00.000Z'), matchAt('m2', '2026-12-19T03:30:00.000Z')],
      TEAMS,
      GROUPS,
    );

    expect(idsByDay(days)).toEqual([['m1'], ['m2']]);
  });

  it('names the teams, the group and a pending result', () => {
    const [day] = buildCategoryMatchDays(
      [matchAt('m1', '2026-12-18T18:00:00.000Z')],
      TEAMS,
      GROUPS,
    );

    expect(day?.rows[0]).toMatchObject({
      teams: 'Viçosa x Pau dos Ferros',
      stage: 'Grupo A',
      time: '15:00',
      summary: 'Aguardando resultado',
      isFinalized: false,
    });
  });

  it('names the knockout round instead of a group', () => {
    const [day] = buildCategoryMatchDays(
      [
        matchAt('m1', '2026-12-18T18:00:00.000Z', {
          stage: 'KNOCKOUT',
          groupId: null,
          round: 'FINAL',
        }),
      ],
      TEAMS,
      GROUPS,
    );

    expect(day?.rows[0]?.stage).toBe('Final');
  });
});
