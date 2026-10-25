import type { MatchRound } from '../enums/match.enums';

export interface FixtureSuggestionDto {
  round: number;
  teamAId: string;
  teamBId: string;
}

export interface BracketMatchSuggestionDto {
  round: MatchRound;
  bracketPosition: number;
  teamAId: string;
  teamBId: string;
  scheduledAt: string | null;
  matchId: string | null;
}
