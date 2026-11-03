import type { RecentResult } from '../types';

const WALKOVER_LABEL = 'W.O.';
const DOUBLE_WALKOVER_LABEL = 'W.O. dos dois';

export function describeScore(result: RecentResult): string {
  if (result.resultType === 'DOUBLE_WALKOVER') {
    return DOUBLE_WALKOVER_LABEL;
  }
  if (result.resultType === 'WALKOVER') {
    return WALKOVER_LABEL;
  }
  return `${result.scoreA} x ${result.scoreB}`;
}
