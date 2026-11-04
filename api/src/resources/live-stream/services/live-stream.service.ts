import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { apiError } from '../../../common/errors/api-error';
import { MediaUploadService } from '../../../storage/services/media-upload.service';
import type { CreateLiveStreamDto } from '../dto/create-live-stream.dto';
import type { UpdateLiveStreamDto } from '../dto/update-live-stream.dto';
import type { LiveStream } from '../entities/live-stream.entity';
import { LiveStreamRepository, type LiveStreamChanges } from '../repository/live-stream.repository';
import { extractYoutubeVideoId } from '../rules/youtube-video-id.rule';

function videoIdOrFail(url: string): string {
  const videoId = extractYoutubeVideoId(url);
  if (!videoId) {
    throw new BadRequestException(
      apiError(
        'YOUTUBE_URL_INVALID',
        'Informe um link válido de um vídeo ou live do YouTube.',
        'url',
      ),
    );
  }
  return videoId;
}

@Injectable()
export class LiveStreamService {
  public constructor(
    private readonly liveStreamRepository: LiveStreamRepository,
    private readonly mediaUploadService: MediaUploadService,
  ) {}

  public list(): Promise<LiveStream[]> {
    return this.liveStreamRepository.findAll();
  }

  public async findByIdOrFail(id: string): Promise<LiveStream> {
    const liveStream = await this.liveStreamRepository.findById(id);
    if (!liveStream) {
      throw new NotFoundException(
        apiError('LIVE_STREAM_NOT_FOUND', 'Transmissão não encontrada.', 'id'),
      );
    }
    return liveStream;
  }

  public async findActiveOrFail(): Promise<LiveStream> {
    const liveStream = await this.liveStreamRepository.findActive();
    if (!liveStream) {
      throw new NotFoundException(
        apiError('NO_ACTIVE_LIVE_STREAM', 'Nenhuma transmissão está ativa no momento.'),
      );
    }
    return liveStream;
  }

  public async create(input: CreateLiveStreamDto): Promise<LiveStream> {
    return this.liveStreamRepository.create({
      title: input.title.trim(),
      videoId: videoIdOrFail(input.url),
      startsAt: new Date(input.startsAt),
    });
  }

  public async update(id: string, input: UpdateLiveStreamDto): Promise<LiveStream> {
    await this.findByIdOrFail(id);
    await this.liveStreamRepository.update(id, toChanges(input));
    return this.findByIdOrFail(id);
  }

  public async activate(id: string): Promise<LiveStream> {
    await this.findByIdOrFail(id);
    await this.liveStreamRepository.activateOnly(id);
    return this.findByIdOrFail(id);
  }

  public async deactivate(id: string): Promise<LiveStream> {
    await this.findByIdOrFail(id);
    await this.liveStreamRepository.deactivate(id);
    return this.findByIdOrFail(id);
  }

  public async remove(id: string): Promise<void> {
    const liveStream = await this.findByIdOrFail(id);
    await this.liveStreamRepository.remove(id);
    await this.mediaUploadService.discard(liveStream.previewKey);
  }
}

function toChanges(input: UpdateLiveStreamDto): LiveStreamChanges {
  return {
    ...(input.title !== undefined && { title: input.title.trim() }),
    ...(input.url !== undefined && { videoId: videoIdOrFail(input.url) }),
    ...(input.startsAt !== undefined && { startsAt: new Date(input.startsAt) }),
  };
}
