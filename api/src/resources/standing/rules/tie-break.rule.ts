import type { StandingRow } from './standings.rule';

type Criterion = (first: StandingRow, second: StandingRow) => number;

const TIE_BREAK_CRITERIA: Criterion[] = [
  (first, second): number => second.points - first.points,
  (first, second): number => second.goalDifference - first.goalDifference,
  (first, second): number => second.goalsFor - first.goalsFor,
  (first, second): number => first.teamName.localeCompare(second.teamName, 'pt-BR'),
];

export function compareStandingRows(first: StandingRow, second: StandingRow): number {
  for (const criterion of TIE_BREAK_CRITERIA) {
    const difference = criterion(first, second);
    if (difference !== 0) {
      return difference;
    }
  }
  return 0;
}
