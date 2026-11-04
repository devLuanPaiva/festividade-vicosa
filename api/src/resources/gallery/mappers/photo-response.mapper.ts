import type { PhotoResponseDto } from '../dto/photo-response.dto';
import type { Photo } from '../entities/photo.entity';

export function toPhotoResponse(photo: Photo): PhotoResponseDto {
  return {
    id: photo.id,
    subEventId: photo.subEventId,
    photoKey: photo.storageKey,
    sortOrder: photo.sortOrder,
    createdAt: photo.createdAt.toISOString(),
  };
}
