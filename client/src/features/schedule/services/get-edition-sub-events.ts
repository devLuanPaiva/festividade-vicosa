import { fetchApiPage } from '@/lib/api/server-fetch';
import type { Edition, SubEvent } from '../types';

async function fetchSubEventsOfYear(year: number): Promise<SubEvent[]> {
  const [edition] = await fetchApiPage<Edition>(`/editions?year=${year}&limit=1`);
  if (!edition) {
    return [];
  }
  return fetchApiPage<SubEvent>(`/editions/${edition.id}/sub-events`);
}

export async function getEditionSubEvents(year: number): Promise<SubEvent[]> {
  try {
    return await fetchSubEventsOfYear(year);
  } catch {
    return [];
  }
}
