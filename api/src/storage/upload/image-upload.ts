import { BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { apiError } from '../../common/errors/api-error';
import { MAX_UPLOAD_BYTES } from '../services/image-processor.service';

export const IMAGE_UPLOAD_FIELD = 'file';

export const ONE_MINUTE_IN_MILLISECONDS = 60_000;
const UPLOADS_PER_MINUTE = 30;

export const UPLOAD_THROTTLE_OPTIONS = [
  { ttl: ONE_MINUTE_IN_MILLISECONDS, limit: UPLOADS_PER_MINUTE },
];

export const imageUploadInterceptor = FileInterceptor(IMAGE_UPLOAD_FIELD, {
  storage: memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 },
});

export function requireUploadedImage(file: Express.Multer.File | undefined): Buffer {
  if (!file) {
    throw new BadRequestException(
      apiError('FILE_REQUIRED', 'Envie a imagem no campo file.', IMAGE_UPLOAD_FIELD),
    );
  }
  return file.buffer;
}
