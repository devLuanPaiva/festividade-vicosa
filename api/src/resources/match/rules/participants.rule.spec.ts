import { MatchStage } from '../enums/match.enums';
import { findParticipantsProblem, type ParticipantsShape } from './participants.rule';

const CATEGORY = '00000000-0000-4000-8000-000000000005';
const OTHER_CATEGORY = '00000000-0000-4000-8000-000000000006';
const GROUP = '00000000-0000-4000-8000-000000000001';
const OTHER_GROUP = '00000000-0000-4000-8000-000000000002';

const groupMatch: ParticipantsShape = {
  categoryId: CATEGORY,
  stage: MatchStage.GROUP,
  groupId: GROUP,
  group: { categoryId: CATEGORY },
  teamA: { categoryId: CATEGORY, groupId: GROUP },
  teamB: { categoryId: CATEGORY, groupId: GROUP },
};

const knockoutMatch: ParticipantsShape = {
  categoryId: CATEGORY,
  stage: MatchStage.KNOCKOUT,
  groupId: null,
  group: null,
  teamA: { categoryId: CATEGORY, groupId: GROUP },
  teamB: { categoryId: CATEGORY, groupId: OTHER_GROUP },
};

describe('findParticipantsProblem', () => {
  it.each([
    { scenario: 'a group match between teams of the group', match: groupMatch },
    { scenario: 'a knockout match between teams of any group', match: knockoutMatch },
  ])('accepts $scenario', ({ match }) => {
    expect(findParticipantsProblem(match)).toBeNull();
  });

  it.each([
    {
      scenario: 'team A from another category (RN-15)',
      match: { ...groupMatch, teamA: { categoryId: OTHER_CATEGORY, groupId: GROUP } },
      expected: { code: 'TEAM_NOT_IN_CATEGORY', field: 'teamAId' },
    },
    {
      scenario: 'team B from another category (RN-15)',
      match: { ...groupMatch, teamB: { categoryId: OTHER_CATEGORY, groupId: GROUP } },
      expected: { code: 'TEAM_NOT_IN_CATEGORY', field: 'teamBId' },
    },
    {
      scenario: 'a group from another category',
      match: { ...groupMatch, group: { categoryId: OTHER_CATEGORY } },
      expected: { code: 'GROUP_NOT_IN_CATEGORY', field: 'groupId' },
    },
    {
      scenario: 'team A outside the group of the match',
      match: { ...groupMatch, teamA: { categoryId: CATEGORY, groupId: OTHER_GROUP } },
      expected: { code: 'TEAM_NOT_IN_GROUP', field: 'teamAId' },
    },
    {
      scenario: 'team B without group in a group match',
      match: { ...groupMatch, teamB: { categoryId: CATEGORY, groupId: null } },
      expected: { code: 'TEAM_NOT_IN_GROUP', field: 'teamBId' },
    },
  ])('refuses $scenario', ({ match, expected }) => {
    expect(findParticipantsProblem(match)).toMatchObject(expected);
  });
});
