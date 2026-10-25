import type { SubEvent } from '@/features/schedule/types';
import { orNotFound } from '@/lib/api/missing-resource';
import { fetchApiPage, fetchApiResult } from '@/lib/api/server-fetch';
import { albumListPath } from '../lib/album-target';
import type { AlbumPhoto, AlbumTarget, GalleryDay } from '../types';

const MAX_ALBUM_PHOTOS = 500;

export function getSubEvent(subEventId: string): Promise<SubEvent> {
  return orNotFound(fetchApiResult<SubEvent>(`/sub-events/${encodeURIComponent(subEventId)}`));
}

export function getGalleryDays(subEventId: string): Promise<GalleryDay[]> {
  return orNotFound(
    fetchApiPage<GalleryDay>(`/sub-events/${encodeURIComponent(subEventId)}/gallery`),
  );
}

export function getAlbumPhotos(target: AlbumTarget): Promise<AlbumPhoto[]> {
  return orNotFound(fetchApiPage<AlbumPhoto>(`${albumListPath(target)}?limit=${MAX_ALBUM_PHOTOS}`));
}
