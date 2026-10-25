import { describe, expect, it } from 'vitest';
import type { GalleryImage } from '../types';
import { findImageIndex } from './find-image';

const images = ['a', 'b', 'c'].map(
  (id) => ({ id, storageKey: id, thumbUrl: id, largeUrl: id }) satisfies GalleryImage,
);

describe('findImageIndex', () => {
  it('finds the photo that came in the shared link', () => {
    expect(findImageIndex(images, 'c')).toBe(2);
  });

  it.each([['missing'], [null]])('opens nothing for %j', (photoId) => {
    expect(findImageIndex(images, photoId)).toBeNull();
  });
});
