import { BadRequestException } from '@nestjs/common';
import type { MediaUploadService } from '../../../storage/services/media-upload.service';
import type { Match } from '../entities/match.entity';
import { BestPlayerPhotoService } from './best-player-photo.service';
import type { MatchMediaService } from './match-media.service';
import type { MatchService } from './match.service';

function createService(match: Partial<Match>): {
  service: BestPlayerPhotoService;
  updateBestPlayerPhoto: jest.Mock;
  discard: jest.Mock;
} {
  const updateBestPlayerPhoto = jest.fn().mockResolvedValue(undefined);
  const discard = jest.fn().mockResolvedValue(undefined);
  const service = new BestPlayerPhotoService(
    {
      findByIdOrFail: jest.fn().mockResolvedValue(match),
      setBestPlayerPhoto: updateBestPlayerPhoto,
    } as unknown as MatchService,
    { targetFor: jest.fn().mockResolvedValue({}) } as unknown as MatchMediaService,
    {
      upload: jest.fn().mockResolvedValue('new-key.webp'),
      discard,
    } as unknown as MediaUploadService,
  );
  return { service, updateBestPlayerPhoto, discard };
}

describe('BestPlayerPhotoService', () => {
  it('refuses a photo while the match has no best player', async () => {
    const { service, updateBestPlayerPhoto } = createService({ bestPlayerName: null });

    await expect(service.replace('match-1', Buffer.from('image'))).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(updateBestPlayerPhoto).not.toHaveBeenCalled();
  });

  it('replaces the photo and discards the previous file', async () => {
    const { service, updateBestPlayerPhoto, discard } = createService({
      bestPlayerName: 'Ana',
      bestPlayerPhotoKey: 'old-key.webp',
    });

    await service.replace('match-1', Buffer.from('image'));

    expect(updateBestPlayerPhoto).toHaveBeenCalledWith('match-1', 'new-key.webp');
    expect(discard).toHaveBeenCalledWith('old-key.webp');
  });

  it('removes the photo and discards the file', async () => {
    const { service, updateBestPlayerPhoto, discard } = createService({
      bestPlayerName: 'Ana',
      bestPlayerPhotoKey: 'old-key.webp',
    });

    await service.remove('match-1');

    expect(updateBestPlayerPhoto).toHaveBeenCalledWith('match-1', null);
    expect(discard).toHaveBeenCalledWith('old-key.webp');
  });
});
