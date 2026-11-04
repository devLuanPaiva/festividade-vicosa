import type { MediaUploadService } from '../../../storage/services/media-upload.service';
import type { LiveStream } from '../entities/live-stream.entity';
import type { LiveStreamRepository } from '../repository/live-stream.repository';
import { LiveStreamService } from './live-stream.service';

const LIVE_ID = '00000000-0000-4000-8000-0000000000f1';
const VIDEO_ID = 'dQw4w9WgXcQ';
const STARTS_AT = '2026-12-19T22:00:00.000Z';

function createFixture(stored: Partial<LiveStream> | null = { id: LIVE_ID }): {
  service: LiveStreamService;
  repository: {
    create: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
    findById: jest.Mock;
    findActive: jest.Mock;
  };
  media: { discard: jest.Mock };
} {
  const repository = {
    create: jest.fn().mockResolvedValue({ id: LIVE_ID }),
    update: jest.fn().mockResolvedValue(undefined),
    remove: jest.fn().mockResolvedValue(undefined),
    findById: jest.fn().mockResolvedValue(stored),
    findActive: jest.fn().mockResolvedValue(stored),
  };
  const media = { discard: jest.fn().mockResolvedValue(undefined) };
  const service = new LiveStreamService(
    repository as unknown as LiveStreamRepository,
    media as unknown as MediaUploadService,
  );
  return { service, repository, media };
}

describe('LiveStreamService.create', () => {
  it('keeps only the video id of the pasted YouTube link and starts inactive', async () => {
    const { service, repository } = createFixture();

    await service.create({
      title: '  Final do futsal  ',
      url: `https://www.youtube.com/live/${VIDEO_ID}?feature=share`,
      startsAt: STARTS_AT,
    });

    expect(repository.create).toHaveBeenCalledWith({
      title: 'Final do futsal',
      videoId: VIDEO_ID,
      startsAt: new Date(STARTS_AT),
    });
  });

  it('refuses a link that is not a YouTube video and saves nothing', async () => {
    const { service, repository } = createFixture();

    await expect(
      service.create({ title: 'Final', url: 'https://vimeo.com/123', startsAt: STARTS_AT }),
    ).rejects.toMatchObject({ response: { code: 'YOUTUBE_URL_INVALID', field: 'url' } });
    expect(repository.create).not.toHaveBeenCalled();
  });
});

describe('LiveStreamService.update', () => {
  it('changes only the fields that were sent', async () => {
    const { service, repository } = createFixture();

    await service.update(LIVE_ID, { title: 'Semifinal' });

    expect(repository.update).toHaveBeenCalledWith(LIVE_ID, { title: 'Semifinal' });
  });

  it('refuses a new invalid link and keeps the stored video', async () => {
    const { service, repository } = createFixture();

    await expect(service.update(LIVE_ID, { url: 'not a link' })).rejects.toMatchObject({
      response: { code: 'YOUTUBE_URL_INVALID' },
    });
    expect(repository.update).not.toHaveBeenCalled();
  });
});

describe('LiveStreamService.findActiveOrFail', () => {
  it('answers not found when no live stream is active', async () => {
    const { service } = createFixture(null);

    await expect(service.findActiveOrFail()).rejects.toMatchObject({
      response: { code: 'NO_ACTIVE_LIVE_STREAM' },
    });
  });
});

describe('LiveStreamService.remove', () => {
  it('deletes the live stream and its preview art', async () => {
    const { service, media } = createFixture({
      id: LIVE_ID,
      previewKey: 'live/previews/preview-a.webp',
    });

    await service.remove(LIVE_ID);

    expect(media.discard).toHaveBeenCalledWith('live/previews/preview-a.webp');
  });
});
