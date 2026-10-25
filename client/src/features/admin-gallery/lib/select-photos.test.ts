import { describe, expect, it } from 'vitest';
import { MAX_STAGED_PHOTOS, formatFileSize, selectPhotos } from './select-photos';

function file(name: string, type = 'image/jpeg', size = 1000): File {
  return new File([new Uint8Array(size)], name, { type });
}

describe('selectPhotos', () => {
  it('accepts JPG, PNG and WebP photos', () => {
    const result = selectPhotos(
      [file('a.jpg'), file('b.png', 'image/png'), file('c.webp', 'image/webp')],
      0,
    );

    expect(result.accepted.map((photo) => photo.name)).toEqual(['a.jpg', 'b.png', 'c.webp']);
    expect(result.notices).toEqual([]);
  });

  it('explains why a file that is not a supported image was left out', () => {
    const result = selectPhotos([file('video.mp4', 'video/mp4'), file('ok.jpg')], 0);

    expect(result.accepted.map((photo) => photo.name)).toEqual(['ok.jpg']);
    expect(result.notices).toEqual(['video.mp4: envie JPG, PNG ou WebP.']);
  });

  it('refuses a photo above 40 MB before trying to read it', () => {
    const huge = file('huge.jpg', 'image/jpeg', 41 * 1024 * 1024);

    expect(selectPhotos([huge], 0).accepted).toEqual([]);
  });

  it('keeps the selection within the limit, counting what is already staged', () => {
    const files = Array.from({ length: 5 }, (_, index) => file(`${index}.jpg`));

    const result = selectPhotos(files, MAX_STAGED_PHOTOS - 3);

    expect(result.accepted).toHaveLength(3);
    expect(result.notices).toHaveLength(2);
  });
});

describe('formatFileSize', () => {
  it.each([
    { bytes: 500, label: '1 KB' },
    { bytes: 250 * 1024, label: '250 KB' },
    { bytes: 2.5 * 1024 * 1024, label: '2,5 MB' },
  ])('shows $bytes bytes as $label', ({ bytes, label }) => {
    expect(formatFileSize(bytes)).toBe(label);
  });
});
