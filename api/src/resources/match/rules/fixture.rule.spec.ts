import { MatchRound, MatchStage } from '../enums/match.enums';
import { findFixtureProblem, type FixtureShape } from './fixture.rule';

const TEAM_A = '00000000-0000-4000-8000-0000000000a1';
const TEAM_B = '00000000-0000-4000-8000-0000000000b2';
const GROUP = '00000000-0000-4000-8000-000000000001';

const groupFixture: FixtureShape = {
  stage: MatchStage.GROUP,
  groupId: GROUP,
  round: null,
  teamAId: TEAM_A,
  teamBId: TEAM_B,
};

const knockoutFixture: FixtureShape = {
  stage: MatchStage.KNOCKOUT,
  groupId: null,
  round: MatchRound.SEMI_FINAL,
  teamAId: TEAM_A,
  teamBId: TEAM_B,
};

describe('findFixtureProblem', () => {
  it.each([
    { scenario: 'a group stage match', fixture: groupFixture },
    { scenario: 'a knockout match', fixture: knockoutFixture },
  ])('accepts $scenario', ({ fixture }) => {
    expect(findFixtureProblem(fixture)).toBeNull();
  });

  it.each([
    {
      scenario: 'the same team on both sides (RN-15)',
      fixture: { ...groupFixture, teamBId: TEAM_A },
      expected: { code: 'SAME_TEAM', field: 'teamBId' },
    },
    {
      scenario: 'a group stage match without group',
      fixture: { ...groupFixture, groupId: undefined },
      expected: { code: 'GROUP_REQUIRED', field: 'groupId' },
    },
    {
      scenario: 'a group stage match with a round',
      fixture: { ...groupFixture, round: MatchRound.FINAL },
      expected: { code: 'ROUND_NOT_ALLOWED', field: 'round' },
    },
    {
      scenario: 'a knockout match without round',
      fixture: { ...knockoutFixture, round: undefined },
      expected: { code: 'ROUND_REQUIRED', field: 'round' },
    },
    {
      scenario: 'a knockout match with a group',
      fixture: { ...knockoutFixture, groupId: GROUP },
      expected: { code: 'GROUP_NOT_ALLOWED', field: 'groupId' },
    },
  ])('refuses $scenario', ({ fixture, expected }) => {
    expect(findFixtureProblem(fixture)).toMatchObject(expected);
  });
});
