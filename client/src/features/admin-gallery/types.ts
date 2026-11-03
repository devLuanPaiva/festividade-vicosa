export type AlbumTarget =
  { kind: 'event-day'; subEventId: string; date: string } | { kind: 'match'; matchId: string };

export type { GalleryDay, GalleryPhoto as AlbumPhoto } from '@/features/gallery/types';

export type UploadStatus = 'waiting' | 'uploading' | 'done' | 'failed';

export interface UploadItem {
  id: number;
  name: string;
  status: UploadStatus;
  message: string | null;
}
