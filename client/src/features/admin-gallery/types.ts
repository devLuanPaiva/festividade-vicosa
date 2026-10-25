export type AlbumTarget =
  { kind: 'event-day'; subEventId: string; date: string } | { kind: 'match'; matchId: string };

export type { GalleryDay, GalleryPhoto as AlbumPhoto } from '@/features/gallery/types';

export type StagedStatus = 'staged' | 'waiting' | 'uploading' | 'done' | 'failed';

export interface StagedPhoto {
  id: number;
  file: File;
  status: StagedStatus;
  message: string | null;
}
