export interface GalleryPhoto {
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

export interface GalleryImage {
  id: string;
  storageKey: string;
  thumbUrl: string;
  largeUrl: string;
}
