import { getMediaPublicUrl } from '@/lib/config/server-env';

const ABSOLUTE_URL_PATTERN = /^https?:\/\//;

export type PhotoVariant = 'thumb' | 'medium' | 'large';

export function resolvePhotoUrl(
  photoKey: string | null,
  variant: PhotoVariant = 'medium',
): string | null {
  if (!photoKey) {
    return null;
  }
  if (ABSOLUTE_URL_PATTERN.test(photoKey)) {
    return photoKey;
  }
  return `${getMediaPublicUrl()}/${photoKey}-${variant}.webp`;
}

export function isVectorPhoto(url: string): boolean {
  return url.includes('/svg') || url.endsWith('.svg');
}
