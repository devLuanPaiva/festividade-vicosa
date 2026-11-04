import type { LiveStreamResponseDto } from '../dto/live-stream-response.dto';
import type { LiveStream } from '../entities/live-stream.entity';

export function toLiveStreamResponse(liveStream: LiveStream): LiveStreamResponseDto {
  return {
    id: liveStream.id,
    title: liveStream.title,
    videoId: liveStream.videoId,
    previewKey: liveStream.previewKey,
    startsAt: liveStream.startsAt.toISOString(),
    active: liveStream.active,
  };
}
