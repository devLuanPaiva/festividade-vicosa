import { fetchApiResult } from '@/lib/api/server-fetch';
import type { ActiveLive } from '../types';

export async function getActiveLive(): Promise<ActiveLive | null> {
  try {
    return await fetchApiResult<ActiveLive>('/live-streams/active');
  } catch {
    return null;
  }
}
