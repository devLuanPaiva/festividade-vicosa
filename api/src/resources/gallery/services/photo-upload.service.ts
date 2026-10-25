import { Injectable } from '@nestjs/common';
import { MediaFolder, type MediaTarget } from '../../../storage/rules/media-key.rule';
import { MediaUploadService } from '../../../storage/services/media-upload.service';
import type { Photo } from '../entities/photo.entity';
import { PhotoRepository } from '../repository/photo.repository';
import { AlbumService } from './album.service';

export interface PhotoUpload {
  file: Buffer;
  uploadedById: string;
}

@Injectable()
export class PhotoUploadService {
  public constructor(
    private readonly albumService: AlbumService,
    private readonly photoRepository: PhotoRepository,
    private readonly mediaUploadService: MediaUploadService,
  ) {}

  public async addToEventDay(subEventId: string, day: string, upload: PhotoUpload): Promise<Photo> {
    const album = await this.albumService.ensureForEventDay(subEventId, day);
    const target = { folder: MediaFolder.EVENT_PHOTO, ownerId: subEventId, day };
    return this.store(album.id, target, upload);
  }

  public async addToMatch(matchId: string, upload: PhotoUpload): Promise<Photo> {
    const album = await this.albumService.ensureForMatch(matchId);
    return this.store(album.id, { folder: MediaFolder.MATCH_PHOTO, ownerId: matchId }, upload);
  }

  private async store(
    albumId: string,
    target: MediaTarget,
    { file, uploadedById }: PhotoUpload,
  ): Promise<Photo> {
    const storageKey = await this.mediaUploadService.upload(target, file);
    try {
      return await this.photoRepository.create({ albumId, storageKey, uploadedById });
    } catch (error) {
      await this.mediaUploadService.discard(storageKey);
      throw error;
    }
  }
}
