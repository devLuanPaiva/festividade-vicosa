export type AlbumTarget =
  { kind: 'event-day'; subEventId: string; date: string } | { kind: 'match'; matchId: string };

export interface AlbumPhoto {
  id: string;
  albumId: string;
  photoKey: string;
  sortOrder: number;
}

export interface GalleryDay {
  date: string;
  photoCount: number;
  coverPhotoKey: string;
}

export type UploadStatus = 'waiting' | 'uploading' | 'done' | 'failed';

export interface UploadItem {
  id: number;
  name: string;
  status: UploadStatus;
  message: string | null;
}
