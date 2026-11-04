import { toDateInput, toTimeInput } from '@/features/admin-matches/lib/match-schedule';
import type { LiveFormValues, LiveStream } from '../types';

const YOUTUBE_WATCH_URL = 'https://www.youtube.com/watch?v=';

export function toLiveFormValues(liveStream: LiveStream): LiveFormValues {
  return {
    title: liveStream.title,
    url: `${YOUTUBE_WATCH_URL}${liveStream.videoId}`,
    date: toDateInput(liveStream.startsAt),
    time: toTimeInput(liveStream.startsAt),
  };
}
