import type { MediaUploadService } from '../../../storage/services/media-upload.service';
import type { PhotoRepository } from '../repository/photo.repository';
import type { AlbumService } from './album.service';
import { PhotoUploadService } from './photo-upload.service';

const SUB_EVENT_ID = '00000000-0000-4000-8000-0000000000e1';
const MATCH_ID = '00000000-0000-4000-8000-0000000000b1';
const STORAGE_KEY = 'matches/m/photos/photo-aaaaaaaaaaaaaaaaaaaaaaaa';
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
  const repository = { create: jest.fn().mockResolvedValue({ id: 'photo-1' }) };
  const media = { upload: jest.fn().mockResolvedValue(STORAGE_KEY), discard: jest.fn() };
  const service = new PhotoUploadService(
    albums as unknown as AlbumService,
    repository as unknown as PhotoRepository,
    media as unknown as MediaUploadService,
  );
  return { service, repository, media };
}

describe('PhotoUploadService', () => {
  it('stores a gallery photo in the folder of its sub-event and day', async () => {
    const { service, repository, media } = createFixture();

    await service.addToEventDay(SUB_EVENT_ID, '2026-12-09', UPLOAD);

    expect(media.upload).toHaveBeenCalledWith(
      { folder: 'EVENT_PHOTO', ownerId: SUB_EVENT_ID, day: '2026-12-09' },
      UPLOAD.file,
    );
    expect(repository.create).toHaveBeenCalledWith({
      albumId: 'album-day',
      storageKey: STORAGE_KEY,
      uploadedById: 'user-1',
    });
  });

  it('stores a match photo in the folder of the match', async () => {
    const { service, media } = createFixture();

    await service.addToMatch(MATCH_ID, UPLOAD);

    expect(media.upload).toHaveBeenCalledWith(
      { folder: 'MATCH_PHOTO', ownerId: MATCH_ID },
      UPLOAD.file,
    );
  });

  it('removes the uploaded files when the photo cannot be saved', async () => {
    const { service, repository, media } = createFixture();
    repository.create.mockRejectedValue(new Error('database down'));

    await expect(service.addToMatch(MATCH_ID, UPLOAD)).rejects.toThrow('database down');

    expect(media.discard).toHaveBeenCalledWith(STORAGE_KEY);
  });
});
