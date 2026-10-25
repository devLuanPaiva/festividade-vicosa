import { MediaFolder } from '../rules/media-key.rule';
import type { ImageProcessor, ProcessedImage } from './image-processor.service';
import { MediaUploadService } from './media-upload.service';
import type { S3StorageService } from './s3-storage.service';

const TEAM_FOLDERS = ['futsal-sub-15-masculino', 'centro'];
const BASE_KEY = `teams/futsal-sub-15-masculino/centro/team-0123456789abcdef01234567`;

const IMAGES: ProcessedImage[] = (['thumb', 'medium', 'large'] as const).map((variant) => ({
  variant,
  buffer: Buffer.from(variant),
  width: 100,
  height: 100,
}));

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
  const processor = { process: jest.fn().mockResolvedValue(IMAGES) };
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
  it('saves the three sizes next to each other and returns the key that names them all', async () => {
    const { service, storage } = createFixture();

    const key = await service.upload(TARGET, Buffer.from('photo'));

    expect(key).toBe(BASE_KEY);
    const savedNames = (storage.put.mock.calls as [string][]).map(([name]) => name);
    savedNames.sort((first, second) => first.localeCompare(second));
    expect(savedNames).toEqual([
      `${BASE_KEY}-large.webp`,
      `${BASE_KEY}-medium.webp`,
      `${BASE_KEY}-thumb.webp`,
    ]);
    expect(storage.put).toHaveBeenCalledWith(expect.any(String), expect.any(Buffer), 'image/webp');
  });

  it('leaves no half-saved photo behind when one of the sizes fails', async () => {
    const { service, storage } = createFixture();
    storage.put.mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error('network'));

    await expect(service.upload(TARGET, Buffer.from('photo'))).rejects.toThrow('network');

    expect(storage.remove).toHaveBeenCalledWith([
      `${BASE_KEY}-thumb.webp`,
      `${BASE_KEY}-medium.webp`,
      `${BASE_KEY}-large.webp`,
    ]);
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
  it('removes every size of a photo the API wrote', async () => {
    const { service, storage } = createFixture();

    await service.discard(BASE_KEY);

    expect(storage.remove).toHaveBeenCalledWith([
      `${BASE_KEY}-thumb.webp`,
      `${BASE_KEY}-medium.webp`,
      `${BASE_KEY}-large.webp`,
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

    await expect(service.discard(BASE_KEY)).resolves.toBeUndefined();
  });
});
