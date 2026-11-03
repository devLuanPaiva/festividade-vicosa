export interface PhotoResponseDto {
  id: string;
  albumId: string;
  photoKey: string;
  sortOrder: number;
  createdAt: string;
}

export interface GalleryDayResponseDto {
  date: string;
  photoCount: number;
  coverPhotoKey: string;
}
