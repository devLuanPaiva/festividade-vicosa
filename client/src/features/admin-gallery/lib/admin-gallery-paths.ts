import { ADMIN_GALLERY_PATH, ADMIN_MATCHES_PATH } from '@/features/admin-shell/lib/admin-sections';

export function matchResultPath(matchId: string): string {
  return `${ADMIN_MATCHES_PATH}/${matchId}`;
}

export function matchPhotosPath(matchId: string): string {
  return `${matchResultPath(matchId)}/fotos`;
}

export function subEventGalleryPath(subEventId: string): string {
  return `${ADMIN_GALLERY_PATH}/${subEventId}`;
}

export function dayGalleryPath(subEventId: string, date: string): string {
  return `${subEventGalleryPath(subEventId)}/${date}`;
}
