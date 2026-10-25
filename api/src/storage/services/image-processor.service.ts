import { BadRequestException, Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { apiError } from '../../common/errors/api-error';

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const MAX_INPUT_PIXELS = 60_000_000;
const ACCEPTED_FORMATS = ['jpeg', 'png', 'webp'];
const UPLOAD_FIELD = 'file';
const OUTPUT_WIDTH = 1600;
const OUTPUT_QUALITY = 78;

export interface ProcessedImage {
  buffer: Buffer;
  width: number;
  height: number;
}

function unreadableImage(): BadRequestException {
  return new BadRequestException(
    apiError(
      'IMAGE_UNREADABLE',
      'Não foi possível ler a imagem. Envie um arquivo JPG, PNG ou WebP válido.',
      UPLOAD_FIELD,
    ),
  );
}

@Injectable()
export class ImageProcessor {
  public async process(file: Buffer): Promise<ProcessedImage> {
    await this.assertAcceptedImage(file);
    try {
      const { data, info } = await sharp(file, { limitInputPixels: MAX_INPUT_PIXELS })
        .rotate()
        .resize({ width: OUTPUT_WIDTH, withoutEnlargement: true })
        .webp({ quality: OUTPUT_QUALITY })
        .toBuffer({ resolveWithObject: true });
      return { buffer: data, width: info.width, height: info.height };
    } catch {
      throw unreadableImage();
    }
  }

  private async assertAcceptedImage(file: Buffer): Promise<void> {
    const format = await this.readFormat(file);
    if (!format || !ACCEPTED_FORMATS.includes(format)) {
      throw new BadRequestException(
        apiError('FILE_TYPE_INVALID', 'Envie a imagem em JPG, PNG ou WebP.', UPLOAD_FIELD),
      );
    }
  }

  private async readFormat(file: Buffer): Promise<string | undefined> {
    try {
      return (await sharp(file, { limitInputPixels: MAX_INPUT_PIXELS }).metadata()).format;
    } catch {
      throw unreadableImage();
    }
  }
}
