import { Injectable } from '@nestjs/common';
import type { Album } from '../entities/album.entity';
import type { Photo } from '../entities/photo.entity';
import type { AlbumDayRecord } from '../repository/album.repository';
import { PhotoRepository } from '../repository/photo.repository';
import { AlbumService } from './album.service';

@Injectable()
export class GalleryService {
  public constructor(
    private readonly albumService: AlbumService,
    private readonly photoRepository: PhotoRepository,
  ) {}

  public listDays(subEventId: string): Promise<AlbumDayRecord[]> {
    return this.albumService.listDays(subEventId);
  }

  public async listEventDayPhotos(subEventId: string, day: string): Promise<Photo[]> {
    return this.photosOf(await this.albumService.findForEventDay(subEventId, day));
  }

  public async listMatchPhotos(matchId: string): Promise<Photo[]> {
    return this.photosOf(await this.albumService.findForMatch(matchId));
  }

  private photosOf(album: Album | null): Promise<Photo[]> {
    return album ? this.photoRepository.findByAlbum(album.id) : Promise.resolve([]);
  }
}
