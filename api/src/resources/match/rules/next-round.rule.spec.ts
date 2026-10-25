import { MatchRound, MatchStatus } from '../enums/match.enums';
import { suggestNextMatches, type BracketMatchShape } from './next-round.rule';

function bracketMatch(overrides: Partial<BracketMatchShape>): BracketMatchShape {
  return {
    id: 'match',
    round: MatchRound.QUARTER_FINAL,
    bracketPosition: 0,
    status: MatchStatus.SCHEDULED,
    scheduledAt: new Date('2026-12-10T19:00:00Z'),
    teamAId: 'a',
    teamBId: 'b',
    winnerId: null,
    ...overrides,
  };
}

function played(
  bracketPosition: number,
  winnerId: string,
  overrides: Partial<BracketMatchShape> = {},
): BracketMatchShape {
  return bracketMatch({
    id: `played-${bracketPosition}`,
    bracketPosition,
    status: MatchStatus.FINALIZED,
    teamAId: `t${bracketPosition * 2}`,
    teamBId: `t${bracketPosition * 2 + 1}`,
    winnerId,
    ...overrides,
  });
}

describe('suggestNextMatches', () => {
  it('suggests nothing while the sibling match is still open', () => {
    const matches = [played(0, 't0'), bracketMatch({ id: 'open', bracketPosition: 1 })];

    expect(suggestNextMatches(matches)).toEqual([]);
  });

  it('suggests the semifinal with the two winners in their bracket slots', () => {
    const later = new Date('2026-12-11T19:00:00Z');
    const matches = [played(0, 't1'), played(1, 't2', { scheduledAt: later })];

    expect(suggestNextMatches(matches)).toEqual([
      {
        round: MatchRound.SEMI_FINAL,
        bracketPosition: 0,
        teamAId: 't1',
        teamBId: 't2',
        scheduledAt: later,
        matchId: null,
      },
    ]);
  });

  it('keeps the winner of the odd position in the second slot', () => {
    const matches = [played(2, 't4'), played(3, 't7')];

    expect(suggestNextMatches(matches)).toMatchObject([
      { bracketPosition: 1, teamAId: 't4', teamBId: 't7' },
    ]);
  });

  it('suggests the final for the winners and third place for the losers after the semifinals', () => {
    const semifinal = (position: number, winnerId: string): BracketMatchShape =>
      played(position, winnerId, { round: MatchRound.SEMI_FINAL });

    const suggestions = suggestNextMatches([semifinal(0, 't0'), semifinal(1, 't3')]);

    expect(suggestions).toMatchObject([
      { round: MatchRound.FINAL, teamAId: 't0', teamBId: 't3' },
      { round: MatchRound.THIRD_PLACE, teamAId: 't1', teamBId: 't2' },
    ]);
  });

  it('suggests nothing after the final', () => {
    const final = (position: number): BracketMatchShape =>
      played(position, 't0', { round: MatchRound.FINAL });

    expect(suggestNextMatches([final(0), final(1)])).toEqual([]);
  });

  it('skips a next match that already has the right teams', () => {
    const existing = bracketMatch({
      id: 'semifinal',
      round: MatchRound.SEMI_FINAL,
      teamAId: 't1',
      teamBId: 't2',
    });

    expect(suggestNextMatches([played(0, 't1'), played(1, 't2'), existing])).toEqual([]);
  });

  it('proposes fixing a scheduled next match after a corrected result', () => {
    const existing = bracketMatch({
      id: 'semifinal',
      round: MatchRound.SEMI_FINAL,
      scheduledAt: new Date('2026-12-15T19:00:00Z'),
      teamAId: 't0',
      teamBId: 't2',
    });

    const suggestions = suggestNextMatches([played(0, 't1'), played(1, 't2'), existing]);

    expect(suggestions).toEqual([
      {
        round: MatchRound.SEMI_FINAL,
        bracketPosition: 0,
        teamAId: 't1',
        teamBId: 't2',
        scheduledAt: existing.scheduledAt,
        matchId: 'semifinal',
      },
    ]);
  });

  it('leaves a finalized next match alone even when its teams differ', () => {
    const existing = bracketMatch({
      id: 'semifinal',
      round: MatchRound.SEMI_FINAL,
      status: MatchStatus.FINALIZED,
      teamAId: 't0',
      teamBId: 't2',
      winnerId: 't0',
    });

    expect(suggestNextMatches([played(0, 't1'), played(1, 't2'), existing])).toEqual([]);
  });

  it('ignores matches typed by hand without a bracket position', () => {
    const manual = [played(0, 't0', { bracketPosition: null }), played(1, 't2')];

    expect(suggestNextMatches(manual)).toEqual([]);
  });
});
