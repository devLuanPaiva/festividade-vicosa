import { fitWithin } from './fit-within';

const LONGEST_SIDE = 2000;
const MAX_UPLOAD_BYTES = 3.5 * 1024 * 1024;
const OUTPUT_TYPE = 'image/jpeg';
const FIRST_QUALITY = 0.9;
const QUALITY_STEP = 0.1;
const LOWEST_QUALITY = 0.6;
const READ_ERROR = 'Não foi possível ler a imagem. Escolha outra foto em JPG, PNG ou WebP.';

export class ImageResizeError extends Error {
  public constructor(message: string = READ_ERROR) {
    super(message);
    this.name = 'ImageResizeError';
  }
}

async function decode(file: File): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    throw new ImageResizeError();
  }
}

function encode(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new ImageResizeError())),
      OUTPUT_TYPE,
      quality,
    );
  });
}

function draw(bitmap: ImageBitmap): HTMLCanvasElement {
  const { width, height } = fitWithin(bitmap, LONGEST_SIDE);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d')?.drawImage(bitmap, 0, 0, width, height);
  return canvas;
}

async function encodeWithinLimit(
  canvas: HTMLCanvasElement,
  quality = FIRST_QUALITY,
): Promise<Blob> {
  const blob = await encode(canvas, quality);
  const nextQuality = quality - QUALITY_STEP;
  if (blob.size <= MAX_UPLOAD_BYTES || nextQuality < LOWEST_QUALITY) {
    return blob;
  }
  return encodeWithinLimit(canvas, nextQuality);
}

export async function resizeForUpload(file: File): Promise<File> {
  const bitmap = await decode(file);
  try {
    const blob = await encodeWithinLimit(draw(bitmap));
    return new File([blob], 'photo.jpg', { type: OUTPUT_TYPE });
  } finally {
    bitmap.close();
  }
}
