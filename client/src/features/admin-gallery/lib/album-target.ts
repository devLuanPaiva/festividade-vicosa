import type { AlbumTarget } from '../types';

function eventDayPath(subEventId: string, date: string): string {
  return `/sub-events/${encodeURIComponent(subEventId)}/gallery/${encodeURIComponent(date)}`;
}

function matchPhotosApiPath(matchId: string): string {
  return `/matches/${encodeURIComponent(matchId)}/photos`;
}

export function albumListPath(target: AlbumTarget): string {
  if (target.kind === 'match') {
    return matchPhotosApiPath(target.matchId);
  }
  return `${eventDayPath(target.subEventId, target.date)}/uploads`;
}

export function albumUploadPath(target: AlbumTarget): string {
  if (target.kind === 'match') {
    return matchPhotosApiPath(target.matchId);
  }
  return `${eventDayPath(target.subEventId, target.date)}/photos`;
}
