import { fetchApiPage, fetchApiResult } from '@/lib/api/server-fetch';
import { requireSessionToken } from '@/lib/auth/current-user';
import type { LiveStream } from '../types';

const MAX_LIVE_STREAMS = 100;

export async function getLiveStreams(): Promise<LiveStream[]> {
  return fetchApiPage<LiveStream>(
    `/live-streams?limit=${MAX_LIVE_STREAMS}`,
    await requireSessionToken(),
  );
}

export async function getLiveStream(liveId: string): Promise<LiveStream> {
  return fetchApiResult<LiveStream>(
    `/live-streams/${encodeURIComponent(liveId)}`,
    await requireSessionToken(),
  );
}
