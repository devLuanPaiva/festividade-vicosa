import { Injectable } from '@nestjs/common';
import { MediaFolder } from '../../../storage/rules/media-key.rule';
import { MediaUploadService } from '../../../storage/services/media-upload.service';
import type { LiveStream } from '../entities/live-stream.entity';
import { LiveStreamRepository } from '../repository/live-stream.repository';
import { LiveStreamService } from './live-stream.service';

const PREVIEW_TARGET = { folder: MediaFolder.LIVE_PREVIEW, segments: ['previews'] };

@Injectable()
export class LiveStreamPreviewService {
  public constructor(
    private readonly liveStreamService: LiveStreamService,
    private readonly liveStreamRepository: LiveStreamRepository,
    private readonly mediaUploadService: MediaUploadService,
  ) {}

  public async replace(id: string, file: Buffer): Promise<LiveStream> {
    const liveStream = await this.liveStreamService.findByIdOrFail(id);
    const previewKey = await this.mediaUploadService.upload(PREVIEW_TARGET, file);
    await this.saveOrDiscard(liveStream.id, previewKey);
    await this.mediaUploadService.discard(liveStream.previewKey);
    return this.liveStreamService.findByIdOrFail(id);
  }

  public async remove(id: string): Promise<LiveStream> {
    const liveStream = await this.liveStreamService.findByIdOrFail(id);
    await this.liveStreamRepository.update(liveStream.id, { previewKey: null });
    await this.mediaUploadService.discard(liveStream.previewKey);
    return this.liveStreamService.findByIdOrFail(id);
  }

  private async saveOrDiscard(id: string, previewKey: string): Promise<void> {
    try {
      await this.liveStreamRepository.update(id, { previewKey });
    } catch (error) {
      await this.mediaUploadService.discard(previewKey);
      throw error;
    }
  }
}
