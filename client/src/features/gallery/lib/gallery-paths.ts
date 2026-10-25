export const GALLERY_PATH = '/galeria';

export function subEventAlbumsPath(subEventId: string): string {
  return `${GALLERY_PATH}/${subEventId}`;
}

export function dayAlbumPath(subEventId: string, date: string): string {
  return `${subEventAlbumsPath(subEventId)}/${date}`;
}
