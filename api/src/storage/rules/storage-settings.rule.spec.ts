import { readStorageSettings, type StorageEnvironment } from './storage-settings.rule';

const COMPLETE: StorageEnvironment = {
  AWS_REGION: 'sa-east-1',
  AWS_ACCESS_KEY_ID: 'key-id',
  AWS_SECRET_ACCESS_KEY: 'secret',
  S3_BUCKET: 'jocevs',
  MEDIA_PUBLIC_URL: 'https://cdn.jocevs.com.br/',
};

describe('readStorageSettings', () => {
  it('reads the settings and drops the trailing slash of the public address', () => {
    expect(readStorageSettings(COMPLETE)).toEqual({
      region: 'sa-east-1',
      accessKeyId: 'key-id',
      secretAccessKey: 'secret',
      bucket: 'jocevs',
      endpoint: null,
      publicUrl: 'https://cdn.jocevs.com.br',
    });
  });

  it.each(['AWS_REGION', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'] as const)(
    'is not configured while %s is blank, so the API still boots without AWS',
    (variable) => {
      expect(readStorageSettings({ ...COMPLETE, [variable]: '  ' })).toBeNull();
      expect(readStorageSettings({ ...COMPLETE, [variable]: undefined })).toBeNull();
    },
  );

  it('accepts a custom endpoint for a local S3-compatible server', () => {
    const settings = readStorageSettings({ ...COMPLETE, S3_ENDPOINT: 'http://localhost:9000' });

    expect(settings?.endpoint).toBe('http://localhost:9000');
  });
});
