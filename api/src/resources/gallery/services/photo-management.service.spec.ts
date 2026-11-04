import type { MediaUploadService } from '../../../storage/services/media-upload.service';
import type { Photo } from '../entities/photo.entity';
import type { PhotoRepository } from '../repository/photo.repository';
import { PhotoManagementService } from './photo-management.service';

const SUB_EVENT_ID = '00000000-0000-4000-8000-0000000000a1';
const STORAGE_KEY = 'sub-events/s/photo-aaaaaaaaaaaaaaaaaaaaaaaa';

function photo(id: string): Photo {
  return { id, subEventId: SUB_EVENT_ID, storageKey: STORAGE_KEY } as Photo;
}

function createFixture(galleryPhotoIds: string[] = ['p1', 'p2', 'p3']): {
  service: PhotoManagementService;
  repository: {
    findById: jest.Mock;
    findBySubEvent: jest.Mock;
    remove: jest.Mock;
    reorder: jest.Mock;
  };
  media: { discard: jest.Mock };
} {
  const galleryPhotos = galleryPhotoIds.map(photo);
  const repository = {
    findById: jest.fn((id: string) =>
      Promise.resolve(galleryPhotos.find((item) => item.id === id) ?? null),
    ),
    findBySubEvent: jest.fn().mockResolvedValue(galleryPhotos),
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
  it('saves the new order when it holds exactly the photos of the gallery', async () => {
    const { service, repository } = createFixture();

    await service.reorder(['p3', 'p1', 'p2']);

    expect(repository.reorder).toHaveBeenCalledWith(['p3', 'p1', 'p2']);
  });

  it.each([
    { name: 'leaves a photo out', ordered: ['p1', 'p2'] },
    { name: 'repeats a photo', ordered: ['p1', 'p1', 'p2'] },
    { name: 'brings a photo from another sub-event', ordered: ['p1', 'p2', 'other'] },
  ])('refuses an order that $name and changes nothing', async ({ ordered }) => {
    const { service, repository } = createFixture(['p1', 'p2', 'p3']);
    repository.findById.mockImplementation((id: string) =>
      Promise.resolve(
        id === 'other' ? ({ id, subEventId: 'another-sub-event' } as Photo) : photo(id),
      ),
    );

    await expect(service.reorder(ordered)).rejects.toMatchObject({
      response: { code: 'PHOTO_ORDER_INVALID', field: 'photoIds' },
    });
    expect(repository.reorder).not.toHaveBeenCalled();
  });
});
