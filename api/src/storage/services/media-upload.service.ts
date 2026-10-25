import { Injectable, Logger } from '@nestjs/common';
import {
  buildMediaKey,
  isManagedMediaKey,
  objectKeysOf,
  type MediaTarget,
} from '../rules/media-key.rule';
import { ImageProcessor } from './image-processor.service';
import { RandomKeyGenerator } from './random-key.generator';
import { S3StorageService } from './s3-storage.service';

const WEBP_CONTENT_TYPE = 'image/webp';

@Injectable()
export class MediaUploadService {
  private readonly logger = new Logger(MediaUploadService.name);

  public constructor(
    private readonly storage: S3StorageService,
    private readonly imageProcessor: ImageProcessor,
    private readonly randomKeys: RandomKeyGenerator,
  ) {}

  public async upload(target: MediaTarget, file: Buffer): Promise<string> {
    this.storage.assertConfigured();
    const key = buildMediaKey(target, this.randomKeys.next());
    const image = await this.imageProcessor.process(file);
    await this.storage.put(key, image.buffer, WEBP_CONTENT_TYPE);
    return key;
  }

  public async discard(storedKey: string | null): Promise<void> {
    if (!storedKey || !isManagedMediaKey(storedKey)) {
      return;
    }
    try {
      await this.storage.remove(objectKeysOf(storedKey));
    } catch (error) {
      this.logger.warn(`Left files behind in the bucket for ${storedKey}`, error);
    }
  }
}
