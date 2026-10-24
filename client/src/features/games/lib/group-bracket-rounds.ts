import type { MatchListItem, MatchRound } from '../types';
import { roundLabel } from './match-labels';

export interface BracketRound {
  round: MatchRound;
  title: string;
  matches: MatchListItem[];
}

const ROUND_ORDER: MatchRound[] = [
  'ROUND_OF_16',
  'QUARTER_FINAL',
  'SEMI_FINAL',
  'THIRD_PLACE',
  'FINAL',
];

function byBracketPosition(first: MatchListItem, second: MatchListItem): number {
  const firstPosition = first.bracketPosition ?? Number.MAX_SAFE_INTEGER;
  const secondPosition = second.bracketPosition ?? Number.MAX_SAFE_INTEGER;
  return firstPosition - secondPosition || first.scheduledAt.localeCompare(second.scheduledAt);
}

export function groupBracketRounds(matches: MatchListItem[]): BracketRound[] {
  return ROUND_ORDER.map((round) => ({
    round,
    title: roundLabel(round),
    matches: matches.filter((match) => match.round === round).sort(byBracketPosition),
  })).filter((bracketRound) => bracketRound.matches.length > 0);
}
