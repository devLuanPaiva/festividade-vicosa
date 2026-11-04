import { Injectable } from '@nestjs/common';
import { MediaFolder } from '../../../storage/rules/media-key.rule';
import { subEventFolders } from '../../sub-event/rules/sub-event-folders.rule';
import { SubEventService } from '../../sub-event/services/sub-event.service';
import type { Photo } from '../entities/photo.entity';
import { PhotoStoreService, type PhotoUpload } from './photo-store.service';

@Injectable()
export class PhotoUploadService {
  public constructor(
    private readonly subEventService: SubEventService,
    private readonly photoStoreService: PhotoStoreService,
  ) {}

  public async addToSubEvent(subEventId: string, upload: PhotoUpload): Promise<Photo> {
    const subEvent = await this.subEventService.findByIdOrFail(subEventId);
    const target = { folder: MediaFolder.EVENT_PHOTO, segments: subEventFolders(subEvent.type) };
    return this.photoStoreService.save(subEvent.id, target, upload);
  }
}
