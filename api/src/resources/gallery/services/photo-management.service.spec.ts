import type { MediaUploadService } from '../../../storage/services/media-upload.service';
import type { Photo } from '../entities/photo.entity';
import type { PhotoRepository } from '../repository/photo.repository';
import { PhotoManagementService } from './photo-management.service';

const ALBUM_ID = '00000000-0000-4000-8000-0000000000a1';
const STORAGE_KEY = 'sub-events/s/2026-12-09/photo-aaaaaaaaaaaaaaaaaaaaaaaa';

function photo(id: string): Photo {
  return { id, albumId: ALBUM_ID, storageKey: STORAGE_KEY } as Photo;
}

function createFixture(albumPhotoIds: string[] = ['p1', 'p2', 'p3']): {
  service: PhotoManagementService;
  repository: {
    findById: jest.Mock;
    findByAlbum: jest.Mock;
    remove: jest.Mock;
    reorder: jest.Mock;
  };
  media: { discard: jest.Mock };
} {
  const albumPhotos = albumPhotoIds.map(photo);
  const repository = {
    findById: jest.fn((id: string) =>
      Promise.resolve(albumPhotos.find((item) => item.id === id) ?? null),
    ),
    findByAlbum: jest.fn().mockResolvedValue(albumPhotos),
    remove: jest.fn().mockResolvedValue(undefined),
    reorder: jest.fn().mockResolvedValue(undefined),
  };
  const media = { discard: jest.fn().mockResolvedValue(undefined) };
  const service = new PhotoManagementService(
    repository as unknown as PhotoRepository,
    media as unknown as MediaUploadService,
  );
  return { service, repository, media };
}

describe('PhotoManagementService.remove', () => {
  it('deletes the photo record and its files', async () => {
    const { service, repository, media } = createFixture();

    await service.remove('p2');

    expect(repository.remove).toHaveBeenCalledWith('p2');
    expect(media.discard).toHaveBeenCalledWith(STORAGE_KEY);
  });

  it('answers not found for a photo that does not exist', async () => {
    const { service, media } = createFixture();

    await expect(service.remove('missing')).rejects.toMatchObject({
      response: { code: 'PHOTO_NOT_FOUND' },
    });
    expect(media.discard).not.toHaveBeenCalled();
  });
});

describe('PhotoManagementService.reorder', () => {
  it('saves the new order when it holds exactly the photos of the album', async () => {
    const { service, repository } = createFixture();

    await service.reorder(['p3', 'p1', 'p2']);

    expect(repository.reorder).toHaveBeenCalledWith(['p3', 'p1', 'p2']);
  });

  it.each([
    { name: 'leaves a photo out', ordered: ['p1', 'p2'] },
    { name: 'repeats a photo', ordered: ['p1', 'p1', 'p2'] },
    { name: 'brings a photo from another album', ordered: ['p1', 'p2', 'other'] },
  ])('refuses an order that $name and changes nothing', async ({ ordered }) => {
    const { service, repository } = createFixture(['p1', 'p2', 'p3']);
    repository.findById.mockImplementation((id: string) =>
      Promise.resolve(id === 'other' ? ({ id, albumId: 'another-album' } as Photo) : photo(id)),
    );

    await expect(service.reorder(ordered)).rejects.toMatchObject({
      response: { code: 'PHOTO_ORDER_INVALID', field: 'photoIds' },
    });
    expect(repository.reorder).not.toHaveBeenCalled();
  });
});
