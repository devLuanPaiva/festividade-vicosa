import { describe, expect, it } from 'vitest';
import { historyPhotoId, listHistoryPhotos } from './history-photos';

describe('history photos', () => {
  it('pads the position so the id matches the file uploaded to S3', () => {
    expect(historyPhotoId(1)).toBe('history-001');
    expect(historyPhotoId(70)).toBe('history-070');
  });

  it('points each photo to its file in the history folder of the media URL', () => {
    const [first] = listHistoryPhotos();

    expect(first?.url).toBe('https://cdn.jocevs.com.br/history/history-001.jpg');
  });

  it('gives every photo real dimensions for the justified layout', () => {
    const photos = listHistoryPhotos();

    expect(photos).toHaveLength(70);
    expect(photos.every((photo) => photo.width > 0 && photo.height > 0)).toBe(true);
  });
});
