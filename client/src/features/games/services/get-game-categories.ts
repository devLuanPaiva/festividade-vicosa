import { cacheLife, cacheTag } from 'next/cache';
import { fetchApiPage } from '@/lib/api/server-fetch';
import type { Category } from '../types';

const UNAVAILABLE_CACHE_LIFE = { stale: 5, revalidate: 5, expire: 30 };

export async function getSubEventCategories(subEventId: string): Promise<Category[]> {
  'use cache';
  cacheTag('categories');

  try {
    cacheLife('minutes');
    return await fetchApiPage<Category>(`/sub-events/${subEventId}/categories`);
  } catch {
    cacheLife(UNAVAILABLE_CACHE_LIFE);
    return [];
  }
}
