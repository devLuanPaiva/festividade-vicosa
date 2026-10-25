import type { MediaUploadService } from '../../../storage/services/media-upload.service';
import type { PhotoRepository } from '../repository/photo.repository';
import type { AlbumService } from './album.service';
import type { AlbumTargetService } from './album-target.service';
import { PhotoStoreService } from './photo-store.service';
import { PhotoUploadService } from './photo-upload.service';

const SUB_EVENT_ID = '00000000-0000-4000-8000-0000000000e1';
const MATCH_ID = '00000000-0000-4000-8000-0000000000b1';
const STORAGE_KEY =
  'matches/futsal/centro-x-acude-2026-12-09-1930/photos/photo-aaaaaaaaaaaaaaaaaaaaaaaa';
const DAY_TARGET = { folder: 'EVENT_PHOTO', segments: ['jocev-futsal', '2026-12-09'] };
const MATCH_TARGET = {
  folder: 'MATCH_PHOTO',
  segments: ['futsal', 'centro-x-acude-2026-12-09-1930'],
};
const UPLOAD = { file: Buffer.from('photo'), uploadedById: 'user-1' };

function createFixture(): {
  service: PhotoUploadService;
  repository: { create: jest.Mock };
  media: { upload: jest.Mock; discard: jest.Mock };
} {
  const albums = {
    ensureForEventDay: jest.fn().mockResolvedValue({ id: 'album-day' }),
    ensureForMatch: jest.fn().mockResolvedValue({ id: 'album-match' }),
  };
  const targets = {
    forEventDay: jest.fn().mockResolvedValue(DAY_TARGET),
    forMatch: jest.fn().mockResolvedValue(MATCH_TARGET),
  };
  const repository = { create: jest.fn().mockResolvedValue({ id: 'photo-1' }) };
  const media = { upload: jest.fn().mockResolvedValue(STORAGE_KEY), discard: jest.fn() };
  const store = new PhotoStoreService(
    repository as unknown as PhotoRepository,
    media as unknown as MediaUploadService,
  );
  const service = new PhotoUploadService(
    albums as unknown as AlbumService,
    targets as unknown as AlbumTargetService,
    store,
  );
  return { service, repository, media };
}

describe('PhotoUploadService', () => {
  it('stores a gallery photo in the folder of its event and day', async () => {
    const { service, repository, media } = createFixture();

    await service.addToEventDay(SUB_EVENT_ID, '2026-12-09', UPLOAD);

    expect(media.upload).toHaveBeenCalledWith(DAY_TARGET, UPLOAD.file);
    expect(repository.create).toHaveBeenCalledWith({
      albumId: 'album-day',
      storageKey: STORAGE_KEY,
      uploadedById: 'user-1',
    });
  });

  it('stores a match photo in the folder of the game', async () => {
    const { service, media } = createFixture();

    await service.addToMatch(MATCH_ID, UPLOAD);

    expect(media.upload).toHaveBeenCalledWith(MATCH_TARGET, UPLOAD.file);
  });

  it('removes the uploaded files when the photo cannot be saved', async () => {
    const { service, repository, media } = createFixture();
    repository.create.mockRejectedValue(new Error('database down'));

    await expect(service.addToMatch(MATCH_ID, UPLOAD)).rejects.toThrow('database down');

    expect(media.discard).toHaveBeenCalledWith(STORAGE_KEY);
  });
});
