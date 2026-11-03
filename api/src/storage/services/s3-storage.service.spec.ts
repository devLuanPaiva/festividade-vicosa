import type { S3Client } from '@aws-sdk/client-s3';
import type { StorageSettings } from '../rules/storage-settings.rule';
import { S3StorageService } from './s3-storage.service';

const SETTINGS: StorageSettings = {
  region: 'sa-east-1',
  accessKeyId: 'key-id',
  secretAccessKey: 'secret',
  bucket: 'jocevs',
  endpoint: null,
  publicUrl: 'https://cdn.jocevs.com.br',
};

function createService(send: jest.Mock): S3StorageService {
  return new S3StorageService({ send } as unknown as S3Client, SETTINGS);
}

function sentInput(send: jest.Mock): Record<string, unknown> {
  return (send.mock.calls[0] as [{ input: Record<string, unknown> }])[0].input;
}

async function codeOf(action: () => unknown): Promise<string> {
  try {
    await action();
  } catch (error) {
    return (error as { response: { code: string } }).response.code;
  }
  throw new Error('it did not fail');
}

describe('S3StorageService', () => {
  it('saves a file in the bucket with the type and a cache that never expires', async () => {
    const send = jest.fn().mockResolvedValue({});

    await createService(send).put('teams/x/team-k-thumb.webp', Buffer.from('data'), 'image/webp');

    expect(sentInput(send)).toMatchObject({
      Bucket: 'jocevs',
      Key: 'teams/x/team-k-thumb.webp',
      ContentType: 'image/webp',
      CacheControl: 'public, max-age=31536000, immutable',
    });
  });

  it('hides the AWS error from the person using the panel', async () => {
    const send = jest.fn().mockRejectedValue(new Error('AccessDenied: arn:aws:iam::1234:user/x'));

    const code = await codeOf(() => createService(send).put('k', Buffer.from('d'), 'image/webp'));

    expect(code).toBe('STORAGE_UNAVAILABLE');
  });

  it('removes several files in one call and does nothing for an empty list', async () => {
    const send = jest.fn().mockResolvedValue({});
    const service = createService(send);

    await service.remove([]);
    await service.remove(['a.webp', 'b.webp']);

    expect(send).toHaveBeenCalledTimes(1);
    expect(sentInput(send)).toMatchObject({
      Bucket: 'jocevs',
      Delete: { Objects: [{ Key: 'a.webp' }, { Key: 'b.webp' }] },
    });
  });

  it('gives the public address of a file on the CDN', () => {
    expect(createService(jest.fn()).publicUrl('teams/x/team-k-thumb.webp')).toBe(
      'https://cdn.jocevs.com.br/teams/x/team-k-thumb.webp',
    );
  });

  it('says the storage is not configured, instead of failing in a strange way', async () => {
    const service = new S3StorageService(null, null);

    expect(await codeOf(() => service.put('k', Buffer.from('d'), 'image/webp'))).toBe(
      'STORAGE_NOT_CONFIGURED',
    );
    expect(
      await codeOf(() => {
        service.assertConfigured();
      }),
    ).toBe('STORAGE_NOT_CONFIGURED');
  });
});
