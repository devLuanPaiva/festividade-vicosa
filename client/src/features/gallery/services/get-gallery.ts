import { fetchApiPage } from '@/lib/api/server-fetch';
import { toGalleryImages } from '../lib/gallery-images';
import type { GalleryDay, GalleryImage, GalleryPhoto } from '../types';

const MAX_ALBUM_PHOTOS = 500;

async function fetchAlbumImages(path: string): Promise<GalleryImage[]> {
  const photos = await fetchApiPage<GalleryPhoto>(`${path}?limit=${MAX_ALBUM_PHOTOS}`);
  return toGalleryImages(photos);
}

export async function getSubEventDays(subEventId: string): Promise<GalleryDay[]> {
  try {
    return await fetchApiPage<GalleryDay>(`/sub-events/${subEventId}/gallery`);
  } catch {
    return [];
  }
}

export async function getDayImages(subEventId: string, date: string): Promise<GalleryImage[]> {
  try {
    return await fetchAlbumImages(`/sub-events/${subEventId}/gallery/${date}`);
  } catch {
    return [];
  }
}

export async function getMatchImages(matchId: string): Promise<GalleryImage[]> {
  try {
    return await fetchAlbumImages(`/matches/${matchId}/photos`);
  } catch {
    return [];
  }
}
