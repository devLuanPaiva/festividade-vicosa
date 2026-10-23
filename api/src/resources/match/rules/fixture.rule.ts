import { MatchStage, type MatchRound } from '../enums/match.enums';
import { problem, type RuleProblem } from './rule-problem';

export interface FixtureShape {
  stage: MatchStage;
  groupId?: string | null;
  round?: MatchRound | null;
  teamAId: string;
  teamBId: string;
}

function checkDistinctTeams({ teamAId, teamBId }: FixtureShape): RuleProblem | null {
  return teamAId === teamBId
    ? problem('SAME_TEAM', 'Os dois times da partida devem ser diferentes.', 'teamBId')
    : null;
}

function checkGroupStage({ stage, groupId, round }: FixtureShape): RuleProblem | null {
  if (stage !== MatchStage.GROUP) {
    return null;
  }
  if (!groupId) {
    return problem('GROUP_REQUIRED', 'Informe o grupo da partida da fase de grupos.', 'groupId');
  }
  return round
    ? problem('ROUND_NOT_ALLOWED', 'A fase de grupos não tem rodada de mata-mata.', 'round')
    : null;
}

function checkKnockoutStage({ stage, groupId, round }: FixtureShape): RuleProblem | null {
  if (stage !== MatchStage.KNOCKOUT) {
    return null;
  }
  if (!round) {
    return problem('ROUND_REQUIRED', 'Informe a rodada da partida do mata-mata.', 'round');
  }
  return groupId
    ? problem('GROUP_NOT_ALLOWED', 'O mata-mata não pertence a um grupo.', 'groupId')
    : null;
}

export function findFixtureProblem(fixture: FixtureShape): RuleProblem | null {
  return checkDistinctTeams(fixture) ?? checkGroupStage(fixture) ?? checkKnockoutStage(fixture);
}
