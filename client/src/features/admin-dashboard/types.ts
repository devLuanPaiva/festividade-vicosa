export interface Overview {
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

export interface MatchesByDay {
  date: string;
  scheduled: number;
  finalized: number;
}

export interface CategoryProgress {
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

export type ResultType = 'PLAYED' | 'WALKOVER' | 'DOUBLE_WALKOVER';

export interface RecentResult {
  matchId: string;
  categoryName: string;
  teamAName: string;
  teamBName: string;
  scoreA: number | null;
  scoreB: number | null;
  resultType: ResultType;
  finalizedAt: string;
  finalizedByName: string | null;
}

export interface DashboardData {
  overview: Overview;
  matchesByDay: MatchesByDay[];
  categoriesProgress: CategoryProgress[];
  recentResults: RecentResult[];
}

export interface KpiTileData {
  key: string;
  label: string;
  value: string;
  caption: string;
  href: string | null;
  meterPercent: number | null;
  needsAttention: boolean;
}
