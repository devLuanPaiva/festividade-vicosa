import type { Match } from '@/features/games/types';

export function hasGeneratedBracket(matches: Match[]): boolean {
  return matches.some((match) => match.bracketPosition !== null);
}
