import { ADMIN_GALLERY_PATH } from '@/features/admin-shell/lib/admin-sections';

export function subEventGalleryPath(subEventId: string): string {
  return `${ADMIN_GALLERY_PATH}/${subEventId}`;
}

export function dayGalleryPath(subEventId: string, date: string): string {
  return `${subEventGalleryPath(subEventId)}/${date}`;
}
