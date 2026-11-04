import { cache } from 'react';
import { fetchApiCountedPage, fetchApiPage } from '@/lib/api/server-fetch';
import { toGalleryImages } from '../lib/gallery-images';
import type { GalleryImage, GalleryPhoto, GallerySummary } from '../types';

const MAX_GALLERY_PHOTOS = 500;
const EMPTY_SUMMARY: GallerySummary = { photoCount: 0, coverPhotoKey: null };

function photosPath(subEventId: string): string {
  return `/sub-events/${encodeURIComponent(subEventId)}/photos`;
}

export const getSubEventImages = cache(async (subEventId: string): Promise<GalleryImage[]> => {
  try {
    const photos = await fetchApiPage<GalleryPhoto>(
      `${photosPath(subEventId)}?limit=${MAX_GALLERY_PHOTOS}`,
    );
    return toGalleryImages(photos);
  } catch {
    return [];
  }
});

export async function getGallerySummary(subEventId: string): Promise<GallerySummary> {
  try {
    const { items, count } = await fetchApiCountedPage<GalleryPhoto>(
      `${photosPath(subEventId)}?limit=1`,
    );
    return { photoCount: count, coverPhotoKey: items[0]?.photoKey ?? null };
  } catch {
    return EMPTY_SUMMARY;
  }
}
