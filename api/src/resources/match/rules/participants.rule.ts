import { MatchStage } from '../enums/match.enums';
import { problem, type RuleProblem } from './rule-problem';

interface Participant {
  categoryId: string;
  groupId: string | null;
}

export interface ParticipantsShape {
  categoryId: string;
  stage: MatchStage;
  groupId?: string | null;
  group: { categoryId: string } | null;
  teamA: Participant;
  teamB: Participant;
}

const OTHER_CATEGORY_DETAIL = 'O time informado é de outra categoria.';

function checkCategories({
  categoryId,
  group,
  teamA,
  teamB,
}: ParticipantsShape): RuleProblem | null {
  if (teamA.categoryId !== categoryId) {
    return problem('TEAM_NOT_IN_CATEGORY', OTHER_CATEGORY_DETAIL, 'teamAId');
  }
  if (teamB.categoryId !== categoryId) {
    return problem('TEAM_NOT_IN_CATEGORY', OTHER_CATEGORY_DETAIL, 'teamBId');
  }
  return group && group.categoryId !== categoryId
    ? problem('GROUP_NOT_IN_CATEGORY', 'O grupo informado é de outra categoria.', 'groupId')
    : null;
}

function checkGroupMembership({
  stage,
  groupId,
  teamA,
  teamB,
}: ParticipantsShape): RuleProblem | null {
  if (stage !== MatchStage.GROUP) {
    return null;
  }
  const detail = 'O time precisa pertencer ao grupo da partida.';
  if (teamA.groupId !== groupId) {
    return problem('TEAM_NOT_IN_GROUP', detail, 'teamAId');
  }
  return teamB.groupId !== groupId ? problem('TEAM_NOT_IN_GROUP', detail, 'teamBId') : null;
}

export function findParticipantsProblem(participants: ParticipantsShape): RuleProblem | null {
  return checkCategories(participants) ?? checkGroupMembership(participants);
}
