export interface OverviewResponseDto {
  categories: number;
  teams: number;
  matches: {
    total: number;
    scheduled: number;
    finalized: number;
    today: number;
    overdue: number;
    walkovers: number;
    completionRate: number;
  };
  goals: {
    total: number;
    perMatch: number;
  };
}

export interface MatchesByDayResponseDto {
  date: string;
  scheduled: number;
  finalized: number;
}

export interface CategoryProgressResponseDto {
  categoryId: string;
  name: string;
  gender: string;
  subEventName: string;
  teams: number;
  matches: number;
  finalized: number;
  completionRate: number;
  goals: number;
  goalsPerMatch: number;
}

export interface RecentResultResponseDto {
  matchId: string;
  categoryName: string;
  teamAName: string;
  teamBName: string;
  scoreA: number | null;
  scoreB: number | null;
  resultType: string;
  finalizedAt: string;
  finalizedByName: string | null;
}
