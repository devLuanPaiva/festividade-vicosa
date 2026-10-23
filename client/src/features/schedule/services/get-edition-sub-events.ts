import { cacheLife, cacheTag } from 'next/cache';
import { fetchApiPage } from '@/lib/api/server-fetch';
import type { Edition, SubEvent } from '../types';

const UNAVAILABLE_CACHE_LIFE = { stale: 5, revalidate: 5, expire: 30 };

async function fetchSubEventsOfYear(year: number): Promise<SubEvent[]> {
  const [edition] = await fetchApiPage<Edition>(`/editions?year=${year}&limit=1`);
  if (!edition) {
    return [];
  }
  return fetchApiPage<SubEvent>(`/editions/${edition.id}/sub-events`);
}

export async function getEditionSubEvents(year: number): Promise<SubEvent[]> {
  'use cache';
  cacheTag('schedule');

  try {
    cacheLife('minutes');
    return await fetchSubEventsOfYear(year);
  } catch {
    cacheLife(UNAVAILABLE_CACHE_LIFE);
    return [];
  }
}
