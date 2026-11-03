import { getMediaPublicUrl } from '@/lib/config/server-env';

const ABSOLUTE_URL_PATTERN = /^https?:\/\//;
const SINGLE_FILE_EXTENSION = '.webp';

export type PhotoVariant = 'thumb' | 'medium' | 'large';

export function resolvePhotoUrl(
  photoKey: string | null,
  legacyVariant: PhotoVariant = 'medium',
): string | null {
  if (!photoKey) {
    return null;
  }
  if (ABSOLUTE_URL_PATTERN.test(photoKey)) {
    return photoKey;
  }
  const publicUrl = getMediaPublicUrl();
  if (photoKey.endsWith(SINGLE_FILE_EXTENSION)) {
    return `${publicUrl}/${photoKey}`;
  }
  return `${publicUrl}/${photoKey}-${legacyVariant}${SINGLE_FILE_EXTENSION}`;
}

export function isVectorPhoto(url: string): boolean {
  return url.includes('/svg') || url.endsWith('.svg');
}
