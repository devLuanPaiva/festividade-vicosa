import type { Match } from '../types';

export interface SideOutcome {
  score: string;
  isWinner: boolean;
  penalties: number | null;
}

export interface MatchOutcome {
  sideA: SideOutcome;
  sideB: SideOutcome;
  note: string | null;
}

const NO_SCORE = '–';

function formatScore(score: number | null): string {
  return score === null ? NO_SCORE : String(score);
}

function resultNote(match: Match): string | null {
  if (match.status === 'SCHEDULED') {
    return null;
  }
  if (match.resultType === 'DOUBLE_WALKOVER') {
    return 'W.O. dos dois times';
  }
  return match.resultType === 'WALKOVER' ? 'Vitória por W.O.' : null;
}

export function getMatchOutcome(match: Match): MatchOutcome {
  return {
    sideA: {
      score: formatScore(match.scoreA),
      isWinner: match.winnerId !== null && match.winnerId === match.teamAId,
      penalties: match.penaltiesA,
    },
    sideB: {
      score: formatScore(match.scoreB),
      isWinner: match.winnerId !== null && match.winnerId === match.teamBId,
      penalties: match.penaltiesB,
    },
    note: resultNote(match),
  };
}
