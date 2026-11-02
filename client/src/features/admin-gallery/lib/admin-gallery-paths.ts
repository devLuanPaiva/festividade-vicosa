import { ADMIN_GALLERY_PATH, ADMIN_MATCHES_PATH } from '@/features/admin-shell/lib/admin-sections';

export function matchResultPath(matchId: string): string {
  return `${ADMIN_MATCHES_PATH}/${matchId}`;
}

export function subEventGalleryPath(subEventId: string): string {
  return `${ADMIN_GALLERY_PATH}/${subEventId}`;
}

export function subEventDaysPath(subEventId: string): string {
  return `${subEventGalleryPath(subEventId)}/dias`;
}

export function subEventMatchesPath(subEventId: string): string {
  return `${subEventGalleryPath(subEventId)}/partidas`;
}

export function matchGalleryPath(subEventId: string, matchId: string): string {
  return `${subEventMatchesPath(subEventId)}/${matchId}`;
}

export function dayGalleryPath(subEventId: string, date: string): string {
  return `${subEventGalleryPath(subEventId)}/${date}`;
}
