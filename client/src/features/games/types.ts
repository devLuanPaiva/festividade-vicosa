export type MatchStage = 'GROUP' | 'KNOCKOUT';

export type MatchRound = 'ROUND_OF_16' | 'QUARTER_FINAL' | 'SEMI_FINAL' | 'THIRD_PLACE' | 'FINAL';

export type MatchStatus = 'SCHEDULED' | 'FINALIZED';

export type MatchResultType = 'PLAYED' | 'WALKOVER' | 'DOUBLE_WALKOVER';

export type Gender = 'MALE' | 'FEMALE';

export interface Team {
  id: string;
  categoryId: string;
  groupId: string | null;
  name: string;
  slug: string;
  city: string;
  abbreviation: string | null;
  photoKey: string | null;
}

export interface Category {
  id: string;
  subEventId: string;
  name: string;
  gender: Gender;
  ageRange: string | null;
}

export interface BestPlayer {
  name: string;
  photoKey: string | null;
  teamId: string;
}

export interface Match {
  id: string;
  categoryId: string;
  stage: MatchStage;
  groupId: string | null;
  round: MatchRound | null;
  bracketPosition: number | null;
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
  bestPlayer: BestPlayer | null;
}

export interface MatchListItem extends Match {
  teamA: Team;
  teamB: Team;
  category: Category;
}

export interface MatchFilters {
  subEventId?: string;
  categoryId?: string;
  status?: MatchStatus;
}
