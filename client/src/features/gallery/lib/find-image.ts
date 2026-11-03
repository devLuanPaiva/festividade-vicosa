import type { GalleryImage } from '../types';

export function findImageIndex(images: GalleryImage[], photoId: string | null): number | null {
  const index = photoId === null ? -1 : images.findIndex((image) => image.id === photoId);
  return index >= 0 ? index : null;
}
