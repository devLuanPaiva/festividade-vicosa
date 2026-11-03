import { DeleteObjectsCommand, PutObjectCommand, type S3Client } from '@aws-sdk/client-s3';
import { Inject, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { apiError } from '../../common/errors/api-error';
import type { StorageSettings } from '../rules/storage-settings.rule';

export const S3_CLIENT = Symbol('S3_CLIENT');
export const STORAGE_SETTINGS = Symbol('STORAGE_SETTINGS');

const IMMUTABLE_CACHE_CONTROL = 'public, max-age=31536000, immutable';

interface ReadyStorage {
  client: S3Client;
  settings: StorageSettings;
}

@Injectable()
export class S3StorageService {
  private readonly logger = new Logger(S3StorageService.name);

  public constructor(
    @Inject(S3_CLIENT) private readonly client: S3Client | null,
    @Inject(STORAGE_SETTINGS) private readonly settings: StorageSettings | null,
  ) {}

  public assertConfigured(): void {
    this.requireReady();
  }

  public publicUrl(key: string): string {
    return `${this.requireReady().settings.publicUrl}/${key}`;
  }

  public async put(key: string, body: Buffer, contentType: string): Promise<void> {
    const { client, settings } = this.requireReady();
    await this.run('save', () =>
      client.send(
        new PutObjectCommand({
          Bucket: settings.bucket,
          Key: key,
          Body: body,
          ContentType: contentType,
          CacheControl: IMMUTABLE_CACHE_CONTROL,
        }),
      ),
    );
  }

  public async remove(keys: string[]): Promise<void> {
    if (keys.length === 0) {
      return;
    }
    const { client, settings } = this.requireReady();
    await this.run('remove', () =>
      client.send(
        new DeleteObjectsCommand({
          Bucket: settings.bucket,
          Delete: { Objects: keys.map((key) => ({ Key: key })), Quiet: true },
        }),
      ),
    );
  }

  private requireReady(): ReadyStorage {
    if (!this.client || !this.settings) {
      throw new ServiceUnavailableException(
        apiError('STORAGE_NOT_CONFIGURED', 'O armazenamento de imagens ainda não foi configurado.'),
      );
    }
    return { client: this.client, settings: this.settings };
  }

  private async run(action: string, operation: () => Promise<unknown>): Promise<void> {
    try {
      await operation();
    } catch (error) {
      this.logger.error(`Could not ${action} the file in the bucket`, error);
      throw new ServiceUnavailableException(
        apiError(
          'STORAGE_UNAVAILABLE',
          'Não foi possível salvar a imagem agora. Tente de novo em instantes.',
        ),
      );
    }
  }
}
