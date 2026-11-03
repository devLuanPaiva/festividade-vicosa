import type { Match, MatchStage } from '@/features/games/types';
import type { ResultDraft } from '../types';

function asText(value: number | null): string {
  return value === null ? '' : String(value);
}

function walkoverWinnerOf(match: Match): string {
  return match.resultType === 'WALKOVER' ? (match.winnerId ?? '') : '';
}

function bestPlayerDraft(match: Match): Pick<ResultDraft, 'bestPlayerName' | 'bestPlayerTeamId'> {
  return {
    bestPlayerName: match.bestPlayer?.name ?? '',
    bestPlayerTeamId: match.bestPlayer?.teamId ?? match.teamAId,
  };
}

export function createResultDraft(match: Match): ResultDraft {
  return {
    resultType: match.resultType,
    scoreA: asText(match.scoreA),
    scoreB: asText(match.scoreB),
    penaltiesA: asText(match.penaltiesA),
    penaltiesB: asText(match.penaltiesB),
    walkoverWinnerId: walkoverWinnerOf(match),
    ...bestPlayerDraft(match),
  };
}

export function needsPenalties(stage: MatchStage, draft: ResultDraft): boolean {
  const isTied = draft.scoreA !== '' && draft.scoreA === draft.scoreB;
  return stage === 'KNOCKOUT' && draft.resultType === 'PLAYED' && isTied;
}
