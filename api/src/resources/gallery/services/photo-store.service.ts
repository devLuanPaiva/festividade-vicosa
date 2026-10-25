import { Injectable } from '@nestjs/common';
import type { MediaTarget } from '../../../storage/rules/media-key.rule';
import { MediaUploadService } from '../../../storage/services/media-upload.service';
import type { Photo } from '../entities/photo.entity';
import { PhotoRepository } from '../repository/photo.repository';

export interface PhotoUpload {
  file: Buffer;
  uploadedById: string;
}

@Injectable()
export class PhotoStoreService {
  public constructor(
    private readonly photoRepository: PhotoRepository,
    private readonly mediaUploadService: MediaUploadService,
  ) {}

  public async save(albumId: string, target: MediaTarget, upload: PhotoUpload): Promise<Photo> {
    const storageKey = await this.mediaUploadService.upload(target, upload.file);
    try {
      return await this.photoRepository.create({
        albumId,
        storageKey,
        uploadedById: upload.uploadedById,
      });
    } catch (error) {
      await this.mediaUploadService.discard(storageKey);
      throw error;
    }
  }
}
