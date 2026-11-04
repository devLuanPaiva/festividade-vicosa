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
    const { subEventId } = await this.findByIdOrFail(firstId);
    const galleryPhotos = await this.photoRepository.findBySubEvent(subEventId);
    const galleryPhotoIds = galleryPhotos.map((photo) => photo.id);
    if (!isCompleteOrder(photoIds, galleryPhotoIds)) {
      throw new BadRequestException(
        apiError(
          'PHOTO_ORDER_INVALID',
          'A lista deve conter todas as fotos da galeria do sub-evento, sem repetir nenhuma.',
          'photoIds',
        ),
      );
    }
    await this.photoRepository.reorder(photoIds);
    return this.photoRepository.findBySubEvent(subEventId);
  }

  private async findByIdOrFail(id: string): Promise<Photo> {
    const photo = await this.photoRepository.findById(id);
    if (!photo) {
      throw new NotFoundException(apiError('PHOTO_NOT_FOUND', 'Foto não encontrada.', 'id'));
    }
    return photo;
  }
}
