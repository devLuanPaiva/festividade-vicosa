import { MatchStage } from '../enums/match.enums';
import {
  findResultProblem,
  resolveWinnerId,
  type ResultInputShape,
  type ResultMatchShape,
} from './result.rule';

const TEAM_A = '00000000-0000-4000-8000-0000000000a1';
const TEAM_B = '00000000-0000-4000-8000-0000000000b2';
const OUTSIDER = '00000000-0000-4000-8000-0000000000c3';

const groupMatch: ResultMatchShape = { stage: MatchStage.GROUP, teamAId: TEAM_A, teamBId: TEAM_B };
const knockoutMatch: ResultMatchShape = {
  stage: MatchStage.KNOCKOUT,
  teamAId: TEAM_A,
  teamBId: TEAM_B,
};

describe('findResultProblem penalties', () => {
  it.each([
    { scenario: 'a group win', match: groupMatch, input: { scoreA: 2, scoreB: 1 } },
    {
      scenario: 'a group draw without penalties (RN-22)',
      match: groupMatch,
      input: { scoreA: 1, scoreB: 1 },
    },
    { scenario: 'a knockout win', match: knockoutMatch, input: { scoreA: 0, scoreB: 3 } },
    {
      scenario: 'a knockout draw decided on penalties (RN-24)',
      match: knockoutMatch,
      input: { scoreA: 2, scoreB: 2, penaltiesA: 4, penaltiesB: 3 },
    },
  ])('accepts $scenario', ({ match, input }) => {
    expect(findResultProblem(match, input)).toBeNull();
  });

  it.each([
    {
      scenario: 'penalties of only one team',
      match: knockoutMatch,
      input: { scoreA: 1, scoreB: 1, penaltiesA: 3 },
      expected: { code: 'PENALTIES_INCOMPLETE', field: 'penaltiesB' },
    },
    {
      scenario: 'penalties in the group stage',
      match: groupMatch,
      input: { scoreA: 1, scoreB: 1, penaltiesA: 3, penaltiesB: 2 },
      expected: { code: 'PENALTIES_NOT_ALLOWED', field: 'penaltiesA' },
    },
    {
      scenario: 'penalties after a knockout win',
      match: knockoutMatch,
      input: { scoreA: 2, scoreB: 1, penaltiesA: 3, penaltiesB: 2 },
      expected: { code: 'PENALTIES_NOT_ALLOWED', field: 'penaltiesA' },
    },
    {
      scenario: 'a knockout draw without penalties',
      match: knockoutMatch,
      input: { scoreA: 1, scoreB: 1 },
      expected: { code: 'PENALTIES_REQUIRED', field: 'penaltiesA' },
    },
    {
      scenario: 'tied penalties',
      match: knockoutMatch,
      input: { scoreA: 1, scoreB: 1, penaltiesA: 3, penaltiesB: 3 },
      expected: { code: 'PENALTIES_TIED', field: 'penaltiesB' },
    },
  ])('refuses $scenario', ({ match, input, expected }) => {
    expect(findResultProblem(match, input)).toMatchObject(expected);
  });
});

describe('findResultProblem best player', () => {
  const score: ResultInputShape = { scoreA: 2, scoreB: 1 };

  it.each([
    { scenario: 'no best player (RN-18)', input: score },
    {
      scenario: 'a best player with photo of team B',
      input: {
        ...score,
        bestPlayerName: 'Bia',
        bestPlayerPhotoKey: 'photos/1',
        bestPlayerTeamId: TEAM_B,
      },
    },
    {
      scenario: 'null best player fields',
      input: { ...score, bestPlayerName: null, bestPlayerTeamId: null },
    },
  ])('accepts $scenario', ({ input }) => {
    expect(findResultProblem(groupMatch, input)).toBeNull();
  });

  it.each([
    {
      scenario: 'a best player from a team outside the match',
      input: { ...score, bestPlayerName: 'Caio', bestPlayerTeamId: OUTSIDER },
      expected: { code: 'BEST_PLAYER_TEAM_INVALID', field: 'bestPlayerTeamId' },
    },
    {
      scenario: 'a best player without team',
      input: { ...score, bestPlayerName: 'Caio' },
      expected: { code: 'BEST_PLAYER_TEAM_INVALID', field: 'bestPlayerTeamId' },
    },
    {
      scenario: 'a best player team without name',
      input: { ...score, bestPlayerTeamId: TEAM_A },
      expected: { code: 'BEST_PLAYER_NAME_REQUIRED', field: 'bestPlayerName' },
    },
    {
      scenario: 'a best player photo without name',
      input: { ...score, bestPlayerPhotoKey: 'photos/1' },
      expected: { code: 'BEST_PLAYER_NAME_REQUIRED', field: 'bestPlayerName' },
    },
  ])('refuses $scenario', ({ input, expected }) => {
    expect(findResultProblem(groupMatch, input)).toMatchObject(expected);
  });
});

describe('resolveWinnerId', () => {
  it.each([
    {
      scenario: 'team A scores more',
      match: groupMatch,
      input: { scoreA: 3, scoreB: 1 },
      expected: TEAM_A,
    },
    {
      scenario: 'team B scores more',
      match: groupMatch,
      input: { scoreA: 0, scoreB: 1 },
      expected: TEAM_B,
    },
    {
      scenario: 'a group draw has no winner',
      match: groupMatch,
      input: { scoreA: 2, scoreB: 2 },
      expected: null,
    },
    {
      scenario: 'team A wins the penalties without changing the score (RN-24)',
      match: knockoutMatch,
      input: { scoreA: 2, scoreB: 2, penaltiesA: 4, penaltiesB: 3 },
      expected: TEAM_A,
    },
  ])('resolves the winner when $scenario', ({ match, input, expected }) => {
    expect(resolveWinnerId(match, input)).toBe(expected);
  });
});
