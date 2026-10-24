import { fetchApiPage, fetchApiResult } from '@/lib/api/server-fetch';
import type {
  CategoryProgress,
  DashboardData,
  MatchesByDay,
  Overview,
  RecentResult,
} from '../types';

const RECENT_RESULTS_SHOWN = 6;

export async function getDashboardData(token: string): Promise<DashboardData> {
  const [overview, matchesByDay, categoriesProgress, recentResults] = await Promise.all([
    fetchApiResult<Overview>('/indicators/overview', token),
    fetchApiPage<MatchesByDay>('/indicators/matches-by-day', token),
    fetchApiPage<CategoryProgress>('/indicators/categories-progress', token),
    fetchApiPage<RecentResult>(`/indicators/recent-results?limit=${RECENT_RESULTS_SHOWN}`, token),
  ]);
  return { overview, matchesByDay, categoriesProgress, recentResults };
}
