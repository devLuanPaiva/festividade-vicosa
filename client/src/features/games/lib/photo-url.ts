const ABSOLUTE_URL_PATTERN = /^https?:\/\//;

export function resolvePhotoUrl(photoKey: string | null): string | null {
  return photoKey && ABSOLUTE_URL_PATTERN.test(photoKey) ? photoKey : null;
}

export function isVectorPhoto(url: string): boolean {
  return url.includes('/svg') || url.endsWith('.svg');
}
