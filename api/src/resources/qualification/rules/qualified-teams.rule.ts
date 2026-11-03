import { problem, type RuleProblem } from '../../match/rules/rule-problem';

export function findQualifiedTeamsProblem(
  groupTeamIds: string[],
  teamIds: string[],
): RuleProblem | null {
  if (new Set(teamIds).size !== teamIds.length) {
    return problem(
      'QUALIFIED_TEAMS_DUPLICATED',
      'Não repita times na lista de classificados.',
      'teamIds',
    );
  }
  return teamIds.every((teamId) => groupTeamIds.includes(teamId))
    ? null
    : problem('TEAM_NOT_IN_GROUP', 'Todos os classificados devem ser times do grupo.', 'teamIds');
}
