import sharp from 'sharp';
import { ImageProcessor, type ProcessedImage } from './image-processor.service';

const processor = new ImageProcessor();

function photo(
  width: number,
  height: number,
  format: 'jpeg' | 'png' | 'gif' = 'jpeg',
): Promise<Buffer> {
  return sharp({ create: { width, height, channels: 3, background: '#2a78d6' } })
    [format]()
    .toBuffer();
}

function widthOf(images: ProcessedImage[], variant: string): number | undefined {
  return images.find((image) => image.variant === variant)?.width;
}

async function rejectionOf(file: Buffer): Promise<{ code: string; field: string; detail: string }> {
  try {
    await processor.process(file);
  } catch (error) {
    return (error as { response: { code: string; field: string; detail: string } }).response;
  }
  throw new Error('the image was accepted');
}

describe('ImageProcessor', () => {
  it('turns a big photo into the three sizes, all webp, keeping the proportion', async () => {
    const images = await processor.process(await photo(3000, 2000));

    expect(images.map((image) => image.variant)).toEqual(['thumb', 'medium', 'large']);
    expect([320, 960, 1600]).toEqual(images.map((image) => image.width));
    expect(images.map((image) => image.height)).toEqual([213, 640, 1067]);
    for (const image of images) {
      expect((await sharp(image.buffer).metadata()).format).toBe('webp');
    }
  });

  it('never enlarges a small image', async () => {
    const images = await processor.process(await photo(200, 100, 'png'));

    expect(widthOf(images, 'thumb')).toBe(200);
    expect(widthOf(images, 'large')).toBe(200);
  });

  it('stands a phone photo up and drops the location data it carried', async () => {
    const sideways = await sharp({
      create: { width: 400, height: 200, channels: 3, background: '#eb6834' },
    })
      .jpeg()
      .withMetadata({ orientation: 6, exif: { IFD0: { Copyright: 'someone' } } })
      .toBuffer();

    const [thumb] = await processor.process(sideways);
    const metadata = await sharp(thumb?.buffer).metadata();

    expect(thumb?.height).toBeGreaterThan(thumb?.width ?? Infinity);
    expect(metadata.exif).toBeUndefined();
  });

  it('refuses a file that is not an image', async () => {
    expect(await rejectionOf(Buffer.from('not an image at all'))).toEqual({
      code: 'IMAGE_UNREADABLE',
      detail: 'Não foi possível ler a imagem. Envie um arquivo JPG, PNG ou WebP válido.',
      field: 'file',
    });
  });

  it('refuses an image format outside jpg, png and webp', async () => {
    expect(await rejectionOf(await photo(50, 50, 'gif'))).toMatchObject({
      code: 'FILE_TYPE_INVALID',
      field: 'file',
    });
  });
});
