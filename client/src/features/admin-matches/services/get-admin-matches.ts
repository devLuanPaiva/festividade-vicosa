import type { MatchListItem } from '@/features/games/types';
import { fetchApiPage } from '@/lib/api/server-fetch';

const MAX_MATCHES = 1000;

export function getAdminMatches(token: string): Promise<MatchListItem[]> {
  return fetchApiPage<MatchListItem>(`/matches?limit=${MAX_MATCHES}`, token);
}
