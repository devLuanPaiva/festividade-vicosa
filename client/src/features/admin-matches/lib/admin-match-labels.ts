import type { Match } from '@/features/games/types';

export function resultSummary(match: Match): string {
  if (match.status === 'SCHEDULED') {
    return 'Aguardando resultado';
  }
  if (match.resultType === 'DOUBLE_WALKOVER') {
    return 'W.O. dos dois times';
  }
  if (match.resultType === 'WALKOVER') {
    return 'Vitória por W.O.';
  }
  const penalties =
    match.penaltiesA === null ? '' : ` (pên. ${match.penaltiesA} x ${match.penaltiesB})`;
  return `${match.scoreA} x ${match.scoreB}${penalties}`;
}
