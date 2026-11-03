import { S3Client } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import type { EnvironmentVariables } from '../config/environment';
import { readStorageSettings, type StorageSettings } from './rules/storage-settings.rule';
import { ImageProcessor } from './services/image-processor.service';
import { MediaUploadService } from './services/media-upload.service';
import { RandomKeyGenerator } from './services/random-key.generator';
import { S3_CLIENT, S3StorageService, STORAGE_SETTINGS } from './services/s3-storage.service';
import { UPLOAD_THROTTLE_OPTIONS } from './upload/image-upload';

function createStorageSettings(
  config: ConfigService<EnvironmentVariables, true>,
): StorageSettings | null {
  return readStorageSettings({
    AWS_REGION: config.get('AWS_REGION', { infer: true }),
    AWS_ACCESS_KEY_ID: config.get('AWS_ACCESS_KEY_ID', { infer: true }),
    AWS_SECRET_ACCESS_KEY: config.get('AWS_SECRET_ACCESS_KEY', { infer: true }),
    S3_BUCKET: config.get('S3_BUCKET', { infer: true }),
    S3_ENDPOINT: config.get('S3_ENDPOINT', { infer: true }),
    MEDIA_PUBLIC_URL: config.get('MEDIA_PUBLIC_URL', { infer: true }),
  });
}

function createS3Client(settings: StorageSettings | null): S3Client | null {
  if (!settings) {
    return null;
  }
  return new S3Client({
    region: settings.region,
    requestChecksumCalculation: 'WHEN_REQUIRED',
    credentials: { accessKeyId: settings.accessKeyId, secretAccessKey: settings.secretAccessKey },
    ...(settings.endpoint && { endpoint: settings.endpoint, forcePathStyle: true }),
  });
}

@Module({
  imports: [ThrottlerModule.forRoot(UPLOAD_THROTTLE_OPTIONS)],
  providers: [
    { provide: STORAGE_SETTINGS, inject: [ConfigService], useFactory: createStorageSettings },
    { provide: S3_CLIENT, inject: [STORAGE_SETTINGS], useFactory: createS3Client },
    S3StorageService,
    ImageProcessor,
    RandomKeyGenerator,
    MediaUploadService,
  ],
  exports: [MediaUploadService, S3StorageService, ThrottlerModule],
})
export class StorageModule {}
