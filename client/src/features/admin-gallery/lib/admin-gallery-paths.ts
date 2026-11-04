import { ADMIN_GALLERY_PATH } from '@/features/admin-shell/lib/admin-sections';

export function subEventGalleryPath(subEventId: string): string {
  return `${ADMIN_GALLERY_PATH}/${subEventId}`;
}
