import type { SubEvent } from '@/features/schedule/types';
import { orNotFound } from '@/lib/api/missing-resource';
import { fetchApiPage, fetchApiResult } from '@/lib/api/server-fetch';
import { subEventPhotosApiPath } from '../lib/photos-api-path';
import type { SubEventPhoto } from '../types';

const MAX_GALLERY_PHOTOS = 500;

export function getSubEvent(subEventId: string): Promise<SubEvent> {
  return orNotFound(fetchApiResult<SubEvent>(`/sub-events/${encodeURIComponent(subEventId)}`));
}

export function getSubEventPhotos(subEventId: string): Promise<SubEventPhoto[]> {
  return orNotFound(
    fetchApiPage<SubEventPhoto>(`${subEventPhotosApiPath(subEventId)}?limit=${MAX_GALLERY_PHOTOS}`),
  );
}
