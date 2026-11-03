import { describe, expect, it } from 'vitest';
import type { MatchListItem } from '@/features/games/types';
import { toMatchListRow } from './match-list-row';

const NOW = new Date('2026-12-04T15:00:00.000Z');

function matchOf(overrides: Partial<MatchListItem>): MatchListItem {
  return {
    id: 'm1',
    categoryId: 'c1',
    stage: 'GROUP',
    round: null,
    status: 'SCHEDULED',
    scheduledAt: '2026-12-05T11:00:00.000Z',
    location: null,
    resultType: 'PLAYED',
    scoreA: null,
    scoreB: null,
    penaltiesA: null,
    penaltiesB: null,
    teamA: { name: 'Santa Luzia' },
    teamB: { name: 'São José' },
    category: { name: 'Adulto', gender: 'MALE' },
    ...overrides,
  } as MatchListItem;
}

describe('toMatchListRow', () => {
  it('writes the date in the local time with weekday, and "A definir" without a place', () => {
    const row = toMatchListRow(matchOf({}), NOW);

    expect(row.when).toBe('sáb 05/12 · 08:00');
    expect(row.location).toBe('A definir');
    expect(row).toMatchObject({ status: 'scheduled', statusLabel: 'Agendada', result: null });
  });

  it('marks a scheduled match that is past its time as without result', () => {
    const row = toMatchListRow(matchOf({ scheduledAt: '2026-12-04T11:00:00.000Z' }), NOW);

    expect(row).toMatchObject({ status: 'overdue', statusLabel: 'Sem resultado' });
  });

  it('shows the result of a finalized match, with penalties when they decided it', () => {
    const row = toMatchListRow(
      matchOf({
        status: 'FINALIZED',
        stage: 'KNOCKOUT',
        round: 'FINAL',
        scoreA: 2,
        scoreB: 2,
        penaltiesA: 4,
        penaltiesB: 3,
      }),
      NOW,
    );

    expect(row).toMatchObject({
      status: 'finalized',
      statusLabel: 'Finalizada',
      stage: 'Final',
      result: '2 x 2 (pên. 4 x 3)',
    });
  });
});
