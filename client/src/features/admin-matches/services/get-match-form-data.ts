import {
  getCategoryRoster,
  type CategoryRoster,
} from '@/features/admin-teams/services/get-category-roster';
import type { Match } from '@/features/games/types';
import { fetchApiResult } from '@/lib/api/server-fetch';

export interface MatchFormData extends CategoryRoster {
  match: Match;
}

export async function getMatchFormData(matchId: string): Promise<MatchFormData> {
  const match = await fetchApiResult<Match>(`/matches/${matchId}`);
  return { match, ...(await getCategoryRoster(match.categoryId)) };
}
