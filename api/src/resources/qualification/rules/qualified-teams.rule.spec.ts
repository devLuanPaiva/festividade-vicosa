import { findQualifiedTeamsProblem } from './qualified-teams.rule';

const GROUP = ['alfa', 'beta', 'gama'];

describe('findQualifiedTeamsProblem', () => {
  it.each([[[]], [['gama', 'alfa']]])('accepts %j from the teams of the group', (teamIds) => {
    expect(findQualifiedTeamsProblem(GROUP, teamIds)).toBeNull();
  });

  it('refuses a repeated team', () => {
    expect(findQualifiedTeamsProblem(GROUP, ['alfa', 'alfa'])).toMatchObject({
      code: 'QUALIFIED_TEAMS_DUPLICATED',
      field: 'teamIds',
    });
  });

  it('refuses a team that is not in the group', () => {
    expect(findQualifiedTeamsProblem(GROUP, ['alfa', 'delta'])).toMatchObject({
      code: 'TEAM_NOT_IN_GROUP',
      field: 'teamIds',
    });
  });
});
