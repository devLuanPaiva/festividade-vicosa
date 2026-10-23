import { MatchRound } from '../enums/match.enums';
import {
  findBracketTeamsProblem,
  firstRoundFor,
  loserDestination,
  pairFirstRound,
  siblingPosition,
  winnerDestination,
} from './bracket.rule';

function teams(count: number): string[] {
  return Array.from({ length: count }, (_, index) => `seed-${index + 1}`);
}

function pairsOf(count: number): string[] {
  return pairFirstRound(teams(count)).map(
    ({ teamAId, teamBId }) => `${teamAId.slice(5)}x${teamBId.slice(5)}`,
  );
}

describe('findBracketTeamsProblem', () => {
  it.each([2, 16])('accepts %i distinct teams', (count) => {
    expect(findBracketTeamsProblem(teams(count))).toBeNull();
  });

  it.each([0, 3, 17])('refuses %i teams', (count) => {
    expect(findBracketTeamsProblem(teams(count))).toMatchObject({
      code: 'BRACKET_SIZE_INVALID',
      field: 'teamIds',
    });
  });

  it('refuses a repeated team', () => {
    expect(findBracketTeamsProblem(['a', 'b', 'c', 'a'])).toMatchObject({
      code: 'BRACKET_TEAMS_DUPLICATED',
    });
  });
});

describe('firstRoundFor', () => {
  it.each([
    [2, MatchRound.FINAL],
    [4, MatchRound.SEMI_FINAL],
    [8, MatchRound.QUARTER_FINAL],
    [16, MatchRound.ROUND_OF_16],
  ])('starts %i teams at %s', (count, round) => {
    expect(firstRoundFor(count)).toBe(round);
  });
});

describe('pairFirstRound', () => {
  it.each([
    [2, ['1x2']],
    [4, ['1x4', '2x3']],
    [8, ['1x8', '4x5', '2x7', '3x6']],
    [16, ['1x16', '8x9', '4x13', '5x12', '2x15', '7x10', '3x14', '6x11']],
  ])('pairs %i seeds so the best seeds meet only late', (count, expected) => {
    expect(pairsOf(count)).toEqual(expected);
  });
});

describe('winnerDestination', () => {
  const cases = [
    {
      round: MatchRound.ROUND_OF_16,
      position: 0,
      next: MatchRound.QUARTER_FINAL,
      nextPosition: 0,
      slot: 'teamAId',
    },
    {
      round: MatchRound.ROUND_OF_16,
      position: 3,
      next: MatchRound.QUARTER_FINAL,
      nextPosition: 1,
      slot: 'teamBId',
    },
    {
      round: MatchRound.QUARTER_FINAL,
      position: 2,
      next: MatchRound.SEMI_FINAL,
      nextPosition: 1,
      slot: 'teamAId',
    },
    {
      round: MatchRound.SEMI_FINAL,
      position: 1,
      next: MatchRound.FINAL,
      nextPosition: 0,
      slot: 'teamBId',
    },
  ];

  it.each(cases)('sends the winner of $round #$position to $next #$nextPosition', (testCase) => {
    expect(winnerDestination(testCase.round, testCase.position)).toEqual({
      round: testCase.next,
      bracketPosition: testCase.nextPosition,
      slot: testCase.slot,
    });
  });

  it('has no destination after the final or the third place', () => {
    expect(winnerDestination(MatchRound.FINAL, 0)).toBeNull();
    expect(winnerDestination(MatchRound.THIRD_PLACE, 0)).toBeNull();
  });
});

describe('loserDestination', () => {
  it('sends the semifinal losers to the third place match', () => {
    expect(loserDestination(MatchRound.SEMI_FINAL, 0)).toEqual({
      round: MatchRound.THIRD_PLACE,
      bracketPosition: 0,
      slot: 'teamAId',
    });
    expect(loserDestination(MatchRound.SEMI_FINAL, 1)?.slot).toBe('teamBId');
  });

  it('keeps the losers of every other round out', () => {
    expect(loserDestination(MatchRound.QUARTER_FINAL, 0)).toBeNull();
  });
});

describe('siblingPosition', () => {
  it.each([
    [0, 1],
    [7, 6],
  ])('pairs position %i with %i', (position, sibling) => {
    expect(siblingPosition(position)).toBe(sibling);
  });
});
