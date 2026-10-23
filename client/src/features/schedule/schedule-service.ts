import { fetchApiPage } from '@/lib/api/server-fetch';
import type { Edition, SubEvent } from './schedule-types';

export async function fetchSubEventsOfEdition(year: number): Promise<SubEvent[]> {
  const [edition] = await fetchApiPage<Edition>(`/editions?year=${year}&limit=1`);
  if (!edition) {
    return [];
  }
  return fetchApiPage<SubEvent>(`/editions/${edition.id}/sub-events`);
}
