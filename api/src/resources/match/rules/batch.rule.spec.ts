import { MatchRound, MatchStage } from '../enums/match.enums';
import { findBatchProblem, type BatchItem, type ExistingMatchShape } from './batch.rule';

const GROUP_ID = 'group';

function groupItem(teamAId: string, teamBId: string): BatchItem {
  return { stage: MatchStage.GROUP, groupId: GROUP_ID, teamAId, teamBId };
}

function bracketItem(round: MatchRound, bracketPosition: number): BatchItem {
  return { stage: MatchStage.KNOCKOUT, round, bracketPosition, teamAId: 'a', teamBId: 'b' };
}

function existing(overrides: Partial<ExistingMatchShape>): ExistingMatchShape {
  return {
    stage: MatchStage.GROUP,
    groupId: GROUP_ID,
    round: null,
    bracketPosition: null,
    teamAId: 'a',
    teamBId: 'b',
    ...overrides,
  };
}

function firstRound(round: MatchRound, count: number): BatchItem[] {
  return Array.from({ length: count }, (_, position) => bracketItem(round, position));
}

describe('findBatchProblem for the group stage', () => {
  it('accepts new pairings of a group', () => {
    expect(findBatchProblem([groupItem('a', 'b'), groupItem('a', 'c')], [])).toBeNull();
  });

  it('refuses a pairing repeated in the same request, even with the sides swapped', () => {
    expect(findBatchProblem([groupItem('a', 'b'), groupItem('b', 'a')], [])).toMatchObject({
      code: 'FIXTURE_DUPLICATED',
    });
  });

  it('refuses a pairing that already has a match in the group', () => {
    expect(findBatchProblem([groupItem('b', 'a')], [existing({})])).toMatchObject({
      code: 'FIXTURE_DUPLICATED',
    });
  });

  it('refuses a bracket position on a group match', () => {
    const item = { ...groupItem('a', 'b'), bracketPosition: 0 };

    expect(findBatchProblem([item], [])).toMatchObject({ code: 'BRACKET_POSITION_NOT_ALLOWED' });
  });
});

describe('findBatchProblem for the knockout stage', () => {
  it.each([
    [MatchRound.FINAL, 1],
    [MatchRound.SEMI_FINAL, 2],
    [MatchRound.QUARTER_FINAL, 4],
    [MatchRound.ROUND_OF_16, 8],
    [MatchRound.ROUND_OF_32, 16],
  ])('accepts a complete first round starting at %s with %i matches', (round, count) => {
    expect(findBatchProblem(firstRound(round, count), [])).toBeNull();
  });

  it.each([
    ['an incomplete round', firstRound(MatchRound.ROUND_OF_16, 7)],
    ['a round that does not start the bracket', firstRound(MatchRound.QUARTER_FINAL, 8)],
    [
      'a gap in the positions',
      [bracketItem(MatchRound.SEMI_FINAL, 0), bracketItem(MatchRound.SEMI_FINAL, 3)],
    ],
  ])('refuses the first round with %s', (_scenario, items) => {
    expect(findBatchProblem(items, [])).not.toBeNull();
  });

  it('refuses a position that does not exist in the round', () => {
    expect(findBatchProblem([bracketItem(MatchRound.SEMI_FINAL, 2)], [])).toMatchObject({
      code: 'BRACKET_POSITION_OUT_OF_RANGE',
    });
  });

  it('requires the position of a knockout match', () => {
    const item: BatchItem = {
      stage: MatchStage.KNOCKOUT,
      round: MatchRound.FINAL,
      teamAId: 'a',
      teamBId: 'b',
    };

    expect(findBatchProblem([item], [])).toMatchObject({ code: 'BRACKET_POSITION_REQUIRED' });
  });

  it('accepts later rounds once the bracket exists and refuses an occupied slot', () => {
    const bracket = existing({
      stage: MatchStage.KNOCKOUT,
      groupId: null,
      round: MatchRound.QUARTER_FINAL,
      bracketPosition: 0,
    });

    expect(findBatchProblem([bracketItem(MatchRound.SEMI_FINAL, 0)], [bracket])).toBeNull();
    expect(findBatchProblem([bracketItem(MatchRound.QUARTER_FINAL, 0)], [bracket])).toMatchObject({
      code: 'BRACKET_SLOT_TAKEN',
    });
  });
});
