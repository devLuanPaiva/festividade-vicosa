import { Injectable } from '@nestjs/common';
import { SubEventService } from '../../sub-event/services/sub-event.service';
import type { Photo } from '../entities/photo.entity';
import { PhotoRepository } from '../repository/photo.repository';

@Injectable()
export class GalleryService {
  public constructor(
    private readonly subEventService: SubEventService,
    private readonly photoRepository: PhotoRepository,
  ) {}

  public async listPhotos(subEventId: string): Promise<Photo[]> {
    await this.subEventService.findByIdOrFail(subEventId);
    return this.photoRepository.findBySubEvent(subEventId);
  }
}
