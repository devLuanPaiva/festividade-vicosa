import { cacheLife, cacheTag } from 'next/cache';
import { fetchApiPage } from '@/lib/api/server-fetch';
import type { GroupStandings } from '../types';

const UNAVAILABLE_CACHE_LIFE = { stale: 5, revalidate: 5, expire: 30 };

export async function getCategoryStandings(categoryId: string): Promise<GroupStandings[]> {
  'use cache';
  cacheTag('matches', 'standings');

  try {
    cacheLife('seconds');
    return await fetchApiPage<GroupStandings>(`/categories/${categoryId}/standings`);
  } catch {
    cacheLife(UNAVAILABLE_CACHE_LIFE);
    return [];
  }
}
