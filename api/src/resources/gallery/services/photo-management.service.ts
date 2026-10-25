import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { apiError } from '../../../common/errors/api-error';
import { MediaUploadService } from '../../../storage/services/media-upload.service';
import type { Photo } from '../entities/photo.entity';
import { PhotoRepository } from '../repository/photo.repository';
import { isCompleteOrder } from '../rules/photo-order.rule';

@Injectable()
export class PhotoManagementService {
  public constructor(
    private readonly photoRepository: PhotoRepository,
    private readonly mediaUploadService: MediaUploadService,
  ) {}

  public async remove(id: string): Promise<void> {
    const photo = await this.findByIdOrFail(id);
    await this.photoRepository.remove(photo.id);
    await this.mediaUploadService.discard(photo.storageKey);
  }

  public async reorder(photoIds: string[]): Promise<Photo[]> {
    const [firstId = ''] = photoIds;
    const { albumId } = await this.findByIdOrFail(firstId);
    const albumPhotos = await this.photoRepository.findByAlbum(albumId);
    const albumPhotoIds = albumPhotos.map((photo) => photo.id);
    if (!isCompleteOrder(photoIds, albumPhotoIds)) {
      throw new BadRequestException(
        apiError(
          'PHOTO_ORDER_INVALID',
          'A lista deve conter todas as fotos do álbum, sem repetir nenhuma.',
          'photoIds',
        ),
      );
    }
    await this.photoRepository.reorder(photoIds);
    return this.photoRepository.findByAlbum(albumId);
  }

  private async findByIdOrFail(id: string): Promise<Photo> {
    const photo = await this.photoRepository.findById(id);
    if (!photo) {
      throw new NotFoundException(apiError('PHOTO_NOT_FOUND', 'Foto não encontrada.', 'id'));
    }
    return photo;
  }
}
