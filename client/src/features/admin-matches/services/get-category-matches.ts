import type { Match } from '@/features/games/types';
import { fetchApiPage } from '@/lib/api/server-fetch';

const MAX_MATCHES = 1000;

export function getCategoryMatches(categoryId: string): Promise<Match[]> {
  return fetchApiPage<Match>(`/categories/${categoryId}/matches?limit=${MAX_MATCHES}`);
}
