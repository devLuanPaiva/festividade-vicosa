export interface GalleryPhoto {
  id: string;
  subEventId: string;
  photoKey: string;
  sortOrder: number;
}

export interface GallerySummary {
  photoCount: number;
  coverPhotoKey: string | null;
}

export interface GalleryImage {
  id: string;
  storageKey: string;
  thumbUrl: string;
  largeUrl: string;
}
