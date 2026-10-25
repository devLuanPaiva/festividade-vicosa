import { Injectable, Logger } from '@nestjs/common';
import {
  allVariantKeys,
  buildMediaBaseKey,
  isManagedMediaKey,
  variantKey,
  type MediaTarget,
} from '../rules/media-key.rule';
import { ImageProcessor, type ProcessedImage } from './image-processor.service';
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
    const baseKey = buildMediaBaseKey(target, this.randomKeys.next());
    const images = await this.imageProcessor.process(file);
    await this.saveAll(baseKey, images);
    return baseKey;
  }

  public async discard(baseKey: string | null): Promise<void> {
    if (!baseKey || !isManagedMediaKey(baseKey)) {
      return;
    }
    try {
      await this.storage.remove(allVariantKeys(baseKey));
    } catch (error) {
      this.logger.warn(`Left files behind in the bucket for ${baseKey}`, error);
    }
  }

  private async saveAll(baseKey: string, images: ProcessedImage[]): Promise<void> {
    try {
      await Promise.all(
        images.map((image) =>
          this.storage.put(variantKey(baseKey, image.variant), image.buffer, WEBP_CONTENT_TYPE),
        ),
      );
    } catch (error) {
      await this.discard(baseKey);
      throw error;
    }
  }
}
