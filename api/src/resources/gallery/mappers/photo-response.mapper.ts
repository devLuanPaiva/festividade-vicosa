import type { GalleryDayResponseDto, PhotoResponseDto } from '../dto/photo-response.dto';
import type { Photo } from '../entities/photo.entity';
import type { AlbumDayRecord } from '../repository/album.repository';

export function toPhotoResponse(photo: Photo): PhotoResponseDto {
  return {
    id: photo.id,
    albumId: photo.albumId,
    photoKey: photo.storageKey,
    sortOrder: photo.sortOrder,
    createdAt: photo.createdAt.toISOString(),
  };
}

export function toGalleryDayResponse(day: AlbumDayRecord): GalleryDayResponseDto {
  return { date: day.date, photoCount: day.photoCount, coverPhotoKey: day.coverStorageKey };
}
