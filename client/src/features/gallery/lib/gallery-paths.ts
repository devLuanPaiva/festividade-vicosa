export const GALLERY_PATH = '/galeria';

export function subEventGalleryPath(subEventId: string): string {
  return `${GALLERY_PATH}/${subEventId}`;
}
