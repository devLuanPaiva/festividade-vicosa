import { cacheLife, cacheTag } from 'next/cache';
import { fetchApiPage } from '@/lib/api/server-fetch';
import { toGalleryImages } from '../lib/gallery-images';
import type { GalleryDay, GalleryImage, GalleryPhoto } from '../types';

const UNAVAILABLE_CACHE_LIFE = { stale: 5, revalidate: 5, expire: 30 };
const MAX_ALBUM_PHOTOS = 500;

async function fetchAlbumImages(path: string): Promise<GalleryImage[]> {
  const photos = await fetchApiPage<GalleryPhoto>(`${path}?limit=${MAX_ALBUM_PHOTOS}`);
  return toGalleryImages(photos);
}

export async function getSubEventDays(subEventId: string): Promise<GalleryDay[]> {
  'use cache';
  cacheTag('gallery');

  try {
    cacheLife('minutes');
    return await fetchApiPage<GalleryDay>(`/sub-events/${subEventId}/gallery`);
  } catch {
    cacheLife(UNAVAILABLE_CACHE_LIFE);
    return [];
  }
}

export async function getDayImages(subEventId: string, date: string): Promise<GalleryImage[]> {
  'use cache';
  cacheTag('gallery');

  try {
    cacheLife('minutes');
    return await fetchAlbumImages(`/sub-events/${subEventId}/gallery/${date}`);
  } catch {
    cacheLife(UNAVAILABLE_CACHE_LIFE);
    return [];
  }
}

export async function getMatchImages(matchId: string): Promise<GalleryImage[]> {
  'use cache';
  cacheTag('gallery');

  try {
    cacheLife('minutes');
    return await fetchAlbumImages(`/matches/${matchId}/photos`);
  } catch {
    cacheLife(UNAVAILABLE_CACHE_LIFE);
    return [];
  }
}
