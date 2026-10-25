import { resolvePhotoUrl } from '@/features/games/lib/photo-url';
import type { GalleryImage, GalleryPhoto } from '../types';

export function toGalleryImages(photos: GalleryPhoto[]): GalleryImage[] {
  return photos.flatMap(({ id, photoKey }) => {
    const thumbUrl = resolvePhotoUrl(photoKey, 'thumb');
    const largeUrl = resolvePhotoUrl(photoKey, 'large');
    return thumbUrl && largeUrl ? [{ id, storageKey: photoKey, thumbUrl, largeUrl }] : [];
  });
}
