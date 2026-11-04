import type { MediaUploadService } from '../../../storage/services/media-upload.service';
import type { SubEventService } from '../../sub-event/services/sub-event.service';
import type { PhotoRepository } from '../repository/photo.repository';
import { PhotoStoreService } from './photo-store.service';
import { PhotoUploadService } from './photo-upload.service';

const SUB_EVENT_ID = '00000000-0000-4000-8000-0000000000e1';
const STORAGE_KEY = 'sub-events/jocev-futsal/photo-aaaaaaaaaaaaaaaaaaaaaaaa.webp';
const UPLOAD = { file: Buffer.from('photo'), uploadedById: 'user-1' };

function createFixture(): {
  service: PhotoUploadService;
  repository: { create: jest.Mock };
  media: { upload: jest.Mock; discard: jest.Mock };
} {
  const subEvents = {
    findByIdOrFail: jest.fn().mockResolvedValue({ id: SUB_EVENT_ID, type: 'JOCEV_FUTSAL' }),
  };
  const repository = { create: jest.fn().mockResolvedValue({ id: 'photo-1' }) };
  const media = { upload: jest.fn().mockResolvedValue(STORAGE_KEY), discard: jest.fn() };
  const store = new PhotoStoreService(
    repository as unknown as PhotoRepository,
    media as unknown as MediaUploadService,
  );
  const service = new PhotoUploadService(subEvents as unknown as SubEventService, store);
  return { service, repository, media };
}

describe('PhotoUploadService', () => {
  it('stores a gallery photo in the folder of its sub-event', async () => {
    const { service, repository, media } = createFixture();

    await service.addToSubEvent(SUB_EVENT_ID, UPLOAD);

    expect(media.upload).toHaveBeenCalledWith(
      { folder: 'EVENT_PHOTO', segments: ['jocev-futsal'] },
      UPLOAD.file,
    );
    expect(repository.create).toHaveBeenCalledWith({
      subEventId: SUB_EVENT_ID,
      storageKey: STORAGE_KEY,
      uploadedById: 'user-1',
    });
  });

  it('removes the uploaded files when the photo cannot be saved', async () => {
    const { service, repository, media } = createFixture();
    repository.create.mockRejectedValue(new Error('database down'));

    await expect(service.addToSubEvent(SUB_EVENT_ID, UPLOAD)).rejects.toThrow('database down');

    expect(media.discard).toHaveBeenCalledWith(STORAGE_KEY);
  });
});
