import { cacheLife, cacheTag } from 'next/cache';
import { fetchApiPage } from '@/lib/api/server-fetch';
import type { MatchFilters, MatchListItem } from '../types';

const UNAVAILABLE_CACHE_LIFE = { stale: 5, revalidate: 5, expire: 30 };
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
  return `/matches?${query.toString()}`;
}

export async function getMatches(filters: MatchFilters): Promise<MatchListItem[]> {
  'use cache';
  cacheTag('matches');

  try {
    cacheLife('seconds');
    return await fetchApiPage<MatchListItem>(buildMatchesPath(filters));
  } catch {
    cacheLife(UNAVAILABLE_CACHE_LIFE);
    return [];
  }
}
