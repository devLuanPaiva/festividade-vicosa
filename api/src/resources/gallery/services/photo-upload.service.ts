import { Injectable } from '@nestjs/common';
import type { Photo } from '../entities/photo.entity';
import { AlbumService } from './album.service';
import { AlbumTargetService } from './album-target.service';
import { PhotoStoreService, type PhotoUpload } from './photo-store.service';

@Injectable()
export class PhotoUploadService {
  public constructor(
    private readonly albumService: AlbumService,
    private readonly albumTargetService: AlbumTargetService,
    private readonly photoStoreService: PhotoStoreService,
  ) {}

  public async addToEventDay(subEventId: string, day: string, upload: PhotoUpload): Promise<Photo> {
    const target = await this.albumTargetService.forEventDay(subEventId, day);
    const album = await this.albumService.ensureForEventDay(subEventId, day);
    return this.photoStoreService.save(album.id, target, upload);
  }

  public async addToMatch(matchId: string, upload: PhotoUpload): Promise<Photo> {
    const target = await this.albumTargetService.forMatch(matchId);
    const album = await this.albumService.ensureForMatch(matchId);
    return this.photoStoreService.save(album.id, target, upload);
  }
}
