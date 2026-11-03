import { MatchResultType, MatchStage } from '../enums/match.enums';
import { findResultProblem, resolveWinnerId, type ResultMatchShape } from './result.rule';

const TEAM_A = '00000000-0000-4000-8000-0000000000a1';
const TEAM_B = '00000000-0000-4000-8000-0000000000b2';
const OUTSIDER = '00000000-0000-4000-8000-0000000000c3';

const groupMatch: ResultMatchShape = { stage: MatchStage.GROUP, teamAId: TEAM_A, teamBId: TEAM_B };
const knockoutMatch: ResultMatchShape = {
  stage: MatchStage.KNOCKOUT,
  teamAId: TEAM_A,
  teamBId: TEAM_B,
};

describe('findResultProblem for a walkover', () => {
  it.each([
    {
      scenario: 'a walkover won by team A in the group stage',
      match: groupMatch,
      input: { resultType: MatchResultType.WALKOVER, walkoverWinnerId: TEAM_A },
    },
    {
      scenario: 'a walkover won by team B in the knockout',
      match: knockoutMatch,
      input: { resultType: MatchResultType.WALKOVER, walkoverWinnerId: TEAM_B },
    },
    {
      scenario: 'a double walkover in the group stage',
      match: groupMatch,
      input: { resultType: MatchResultType.DOUBLE_WALKOVER },
    },
  ])('accepts $scenario', ({ match, input }) => {
    expect(findResultProblem(match, input)).toBeNull();
  });

  it.each([
    {
      scenario: 'a walkover without winner',
      match: groupMatch,
      input: { resultType: MatchResultType.WALKOVER },
      expected: { code: 'WALKOVER_WINNER_REQUIRED', field: 'walkoverWinnerId' },
    },
    {
      scenario: 'a walkover won by a team outside the match',
      match: groupMatch,
      input: { resultType: MatchResultType.WALKOVER, walkoverWinnerId: OUTSIDER },
      expected: { code: 'WALKOVER_WINNER_INVALID', field: 'walkoverWinnerId' },
    },
    {
      scenario: 'a walkover with a score',
      match: groupMatch,
      input: {
        resultType: MatchResultType.WALKOVER,
        walkoverWinnerId: TEAM_A,
        scoreA: 1,
        scoreB: 0,
      },
      expected: { code: 'WALKOVER_HAS_NO_PLAY', field: 'scoreA' },
    },
    {
      scenario: 'a walkover with a best player',
      match: groupMatch,
      input: {
        resultType: MatchResultType.WALKOVER,
        walkoverWinnerId: TEAM_A,
        bestPlayerName: 'Ana',
        bestPlayerTeamId: TEAM_A,
      },
      expected: { code: 'WALKOVER_HAS_NO_PLAY' },
    },
    {
      scenario: 'a double walkover with a winner',
      match: groupMatch,
      input: { resultType: MatchResultType.DOUBLE_WALKOVER, walkoverWinnerId: TEAM_A },
      expected: { code: 'DOUBLE_WALKOVER_WITH_WINNER', field: 'walkoverWinnerId' },
    },
    {
      scenario: 'a double walkover in the knockout',
      match: knockoutMatch,
      input: { resultType: MatchResultType.DOUBLE_WALKOVER },
      expected: { code: 'DOUBLE_WALKOVER_IN_KNOCKOUT', field: 'resultType' },
    },
  ])('refuses $scenario', ({ match, input, expected }) => {
    expect(findResultProblem(match, input)).toMatchObject(expected);
  });
});

describe('findResultProblem for a played match', () => {
  it.each([
    { input: { scoreB: 1 }, field: 'scoreA' },
    { input: { scoreA: 1 }, field: 'scoreB' },
    { input: { resultType: MatchResultType.PLAYED, scoreA: null, scoreB: null }, field: 'scoreA' },
  ])('requires both scores: $input', ({ input, field }) => {
    expect(findResultProblem(groupMatch, input)).toMatchObject({ code: 'SCORE_REQUIRED', field });
  });
});

describe('resolveWinnerId for a walkover', () => {
  it('gives the win to the team that showed up', () => {
    const input = { resultType: MatchResultType.WALKOVER, walkoverWinnerId: TEAM_B };

    expect(resolveWinnerId(groupMatch, input)).toBe(TEAM_B);
  });

  it('has no winner when both teams are absent', () => {
    expect(resolveWinnerId(groupMatch, { resultType: MatchResultType.DOUBLE_WALKOVER })).toBeNull();
  });
});
