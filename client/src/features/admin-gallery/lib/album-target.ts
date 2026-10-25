import type { AlbumTarget } from '../types';

export function albumListPath(target: AlbumTarget): string {
  if (target.kind === 'match') {
    return `/matches/${encodeURIComponent(target.matchId)}/photos`;
  }
  const subEventId = encodeURIComponent(target.subEventId);
  return `/sub-events/${subEventId}/gallery/${encodeURIComponent(target.date)}`;
}

export function albumUploadPath(target: AlbumTarget): string {
  return target.kind === 'match' ? albumListPath(target) : `${albumListPath(target)}/photos`;
}
