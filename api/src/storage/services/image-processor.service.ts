import { BadRequestException, Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { apiError } from '../../common/errors/api-error';
import { IMAGE_VARIANTS, type ImageVariant } from '../rules/media-key.rule';

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const MAX_INPUT_PIXELS = 60_000_000;
const ACCEPTED_FORMATS = ['jpeg', 'png', 'webp'];
const UPLOAD_FIELD = 'file';

const VARIANT_SPECS: Record<ImageVariant, { width: number; quality: number }> = {
  thumb: { width: 320, quality: 72 },
  medium: { width: 960, quality: 78 },
  large: { width: 1600, quality: 80 },
};

export interface ProcessedImage {
  variant: ImageVariant;
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
  public async process(file: Buffer): Promise<ProcessedImage[]> {
    await this.assertAcceptedImage(file);
    try {
      return await Promise.all(IMAGE_VARIANTS.map((variant) => this.render(file, variant)));
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

  private async render(file: Buffer, variant: ImageVariant): Promise<ProcessedImage> {
    const { width, quality } = VARIANT_SPECS[variant];
    const { data, info } = await sharp(file, { limitInputPixels: MAX_INPUT_PIXELS })
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toBuffer({ resolveWithObject: true });
    return { variant, buffer: data, width: info.width, height: info.height };
  }
}
