import { cacheLife, cacheTag } from 'next/cache';
import { ApiError } from '@/lib/api/api-response';
import { fetchApiResult } from '@/lib/api/server-fetch';
import type { Category } from '../types';

const UNAVAILABLE_CACHE_LIFE = { stale: 5, revalidate: 5, expire: 30 };

export async function getCategory(categoryId: string): Promise<Category | null> {
  'use cache';
  cacheTag('categories');

  try {
    cacheLife('minutes');
    return await fetchApiResult<Category>(`/categories/${categoryId}`);
  } catch (error) {
    if (!(error instanceof ApiError && error.statusCode < 500)) {
      cacheLife(UNAVAILABLE_CACHE_LIFE);
    }
    return null;
  }
}
