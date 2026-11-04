export type { GalleryPhoto as SubEventPhoto } from '@/features/gallery/types';

export type UploadStatus = 'waiting' | 'uploading' | 'done' | 'failed';

export interface UploadItem {
  id: number;
  name: string;
  status: UploadStatus;
  message: string | null;
}
