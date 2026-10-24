import { describe, expect, it } from 'vitest';
import type { MatchListItem, MatchRound } from '../types';
import { groupBracketRounds } from './group-bracket-rounds';

interface KnockoutSpec {
  id: string;
  round: MatchRound;
  bracketPosition: number | null;
  scheduledAt?: string;
}

function knockout({
  id,
  round,
  bracketPosition,
  scheduledAt = '2026-12-10T12:00:00Z',
}: KnockoutSpec): MatchListItem {
  return { id, round, bracketPosition, scheduledAt } as MatchListItem;
}

describe('groupBracketRounds', () => {
  it('orders the rounds from the first one to the final and skips empty rounds', () => {
    const rounds = groupBracketRounds([
      knockout({ id: 'final', round: 'FINAL', bracketPosition: 1 }),
      knockout({ id: 'semi', round: 'SEMI_FINAL', bracketPosition: 1 }),
      knockout({ id: 'third', round: 'THIRD_PLACE', bracketPosition: 1 }),
    ]);

    expect(rounds.map((item) => item.title)).toEqual(['Semifinal', 'Disputa de 3º lugar', 'Final']);
  });

  it('keeps the matches of a round in bracket order, with undefined positions last', () => {
    const [quarterFinal] = groupBracketRounds([
      knockout({
        id: 'late',
        round: 'QUARTER_FINAL',
        bracketPosition: null,
        scheduledAt: '2026-12-10T10:00:00Z',
      }),
      knockout({ id: 'second', round: 'QUARTER_FINAL', bracketPosition: 2 }),
      knockout({ id: 'first', round: 'QUARTER_FINAL', bracketPosition: 1 }),
    ]);

    expect(quarterFinal?.matches.map((match) => match.id)).toEqual(['first', 'second', 'late']);
  });

  it('returns no rounds when there is no knockout yet', () => {
    expect(groupBracketRounds([])).toEqual([]);
  });
});
