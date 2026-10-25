import { fetchApiPage } from '@/lib/api/server-fetch';
import type { MatchFilters, MatchListItem } from '../types';

const MAX_MATCHES = 1000;

function buildMatchesPath(filters: MatchFilters): string {
  const query = new URLSearchParams({ limit: String(MAX_MATCHES) });
  if (filters.subEventId) {
    query.set('subEventId', filters.subEventId);
  }
  if (filters.categoryId) {
    query.set('categoryId', filters.categoryId);
  }
  if (filters.status) {
    query.set('status', filters.status);
  }
  if (filters.stage) {
    query.set('stage', filters.stage);
  }
  return `/matches?${query.toString()}`;
}

export async function getMatches(filters: MatchFilters): Promise<MatchListItem[]> {
  try {
    return await fetchApiPage<MatchListItem>(buildMatchesPath(filters));
  } catch {
    return [];
  }
}
