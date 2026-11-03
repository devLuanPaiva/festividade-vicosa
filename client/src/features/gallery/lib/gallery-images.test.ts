import { afterEach, describe, expect, it, vi } from 'vitest';
import { toGalleryImages } from './gallery-images';

const KEY = 'sub-events/s/2026-12-09/photo-aaaaaaaaaaaaaaaaaaaaaaaa';

describe('toGalleryImages', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('gives each photo a small picture for the grid and a large one for the viewer', () => {
    vi.stubEnv('MEDIA_PUBLIC_URL', 'https://cdn.example.com');

    expect(toGalleryImages([{ id: 'p1', albumId: 'a', photoKey: KEY, sortOrder: 0 }])).toEqual([
      {
        id: 'p1',
        storageKey: KEY,
        thumbUrl: `https://cdn.example.com/${KEY}-thumb.webp`,
        largeUrl: `https://cdn.example.com/${KEY}-large.webp`,
      },
    ]);
  });

  it('uses the same single file for the grid and the viewer when the photo has one size', () => {
    vi.stubEnv('MEDIA_PUBLIC_URL', 'https://cdn.example.com');
    const singleFileKey = `${KEY}.webp`;

    const [image] = toGalleryImages([
      { id: 'p1', albumId: 'a', photoKey: singleFileKey, sortOrder: 0 },
    ]);

    expect(image?.thumbUrl).toBe(`https://cdn.example.com/${singleFileKey}`);
    expect(image?.largeUrl).toBe(image?.thumbUrl);
  });

  it('keeps the order of the album', () => {
    const photos = ['p3', 'p1', 'p2'].map((id, sortOrder) => ({
      id,
      albumId: 'a',
      photoKey: KEY,
      sortOrder,
    }));

    expect(toGalleryImages(photos).map((image) => image.id)).toEqual(['p3', 'p1', 'p2']);
  });
});
