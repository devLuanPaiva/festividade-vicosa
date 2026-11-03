import { MediaFolder } from '../rules/media-key.rule';
import type { ImageProcessor } from './image-processor.service';
import { MediaUploadService } from './media-upload.service';
import type { S3StorageService } from './s3-storage.service';

const TEAM_FOLDERS = ['futsal-sub-15-masculino', 'centro'];
const KEY = 'teams/futsal-sub-15-masculino/centro/team-0123456789abcdef01234567.webp';
const IMAGE = { buffer: Buffer.from('webp'), width: 1600, height: 1067 };

function createFixture(): {
  service: MediaUploadService;
  storage: { assertConfigured: jest.Mock; put: jest.Mock; remove: jest.Mock };
  processor: { process: jest.Mock };
} {
  const storage = {
    assertConfigured: jest.fn(),
    put: jest.fn().mockResolvedValue(undefined),
    remove: jest.fn().mockResolvedValue(undefined),
  };
  const processor = { process: jest.fn().mockResolvedValue(IMAGE) };
  const randomKeys = { next: (): string => '0123456789abcdef01234567' };
  const service = new MediaUploadService(
    storage as unknown as S3StorageService,
    processor as unknown as ImageProcessor,
    randomKeys,
  );
  return { service, storage, processor };
}

const TARGET = { folder: MediaFolder.TEAM_PHOTO, segments: TEAM_FOLDERS };

describe('MediaUploadService.upload', () => {
  it('saves the photo as one webp file and returns its key', async () => {
    const { service, storage } = createFixture();

    const key = await service.upload(TARGET, Buffer.from('photo'));

    expect(key).toBe(KEY);
    expect(storage.put).toHaveBeenCalledTimes(1);
    expect(storage.put).toHaveBeenCalledWith(KEY, IMAGE.buffer, 'image/webp');
  });

  it('saves nothing when the storage refuses the file', async () => {
    const { service, storage } = createFixture();
    storage.put.mockRejectedValue(new Error('network'));

    await expect(service.upload(TARGET, Buffer.from('photo'))).rejects.toThrow('network');

    expect(storage.remove).not.toHaveBeenCalled();
  });

  it('does not even process the image while the storage is not configured', async () => {
    const { service, storage, processor } = createFixture();
    storage.assertConfigured.mockImplementation(() => {
      throw new Error('not configured');
    });

    await expect(service.upload(TARGET, Buffer.from('photo'))).rejects.toThrow('not configured');

    expect(processor.process).not.toHaveBeenCalled();
  });
});

describe('MediaUploadService.discard', () => {
  it('removes the file of a photo the API wrote', async () => {
    const { service, storage } = createFixture();

    await service.discard(KEY);

    expect(storage.remove).toHaveBeenCalledWith([KEY]);
  });

  it('still removes the three sizes of a photo saved before the single file', async () => {
    const { service, storage } = createFixture();
    const legacyKey = KEY.replace('.webp', '');

    await service.discard(legacyKey);

    expect(storage.remove).toHaveBeenCalledWith([
      `${legacyKey}-thumb.webp`,
      `${legacyKey}-medium.webp`,
      `${legacyKey}-large.webp`,
    ]);
  });

  it('leaves alone what the API did not write, like an external image address', async () => {
    const { service, storage } = createFixture();

    await service.discard('https://upload.wikimedia.org/team.jpg');
    await service.discard(null);

    expect(storage.remove).not.toHaveBeenCalled();
  });

  it('does not break the request when cleaning the old photo fails', async () => {
    const { service, storage } = createFixture();
    storage.remove.mockRejectedValue(new Error('network'));

    await expect(service.discard(KEY)).resolves.toBeUndefined();
  });
});
