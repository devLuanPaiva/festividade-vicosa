import type { MatchResultType, MatchRound, MatchStage, MatchStatus } from '../enums/match.enums';

export interface BestPlayerResponseDto {
  name: string;
  photoKey: string | null;
  teamId: string;
}

export interface MatchResponseDto {
  id: string;
  categoryId: string;
  stage: MatchStage;
  groupId: string | null;
  round: MatchRound | null;
  scheduledAt: string;
  location: string | null;
  status: MatchStatus;
  teamAId: string;
  teamBId: string;
  resultType: MatchResultType;
  scoreA: number | null;
  scoreB: number | null;
  penaltiesA: number | null;
  penaltiesB: number | null;
  winnerId: string | null;
  finalizedAt: string | null;
  bestPlayer: BestPlayerResponseDto | null;
}
