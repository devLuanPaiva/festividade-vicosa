import { describe, expect, it } from 'vitest';
import { movePhoto } from './move-photo';

describe('movePhoto', () => {
  const ids = ['a', 'b', 'c', 'd'];

  it('moves a photo one place later', () => {
    expect(movePhoto(ids, 1, 1)).toEqual(['a', 'c', 'b', 'd']);
  });

  it('moves a photo one place earlier', () => {
    expect(movePhoto(ids, 2, -1)).toEqual(['a', 'c', 'b', 'd']);
  });

  it('keeps the order when the photo is already at the edge', () => {
    expect(movePhoto(ids, 0, -1)).toEqual(ids);
    expect(movePhoto(ids, 3, 1)).toEqual(ids);
  });

  it('keeps the order for a position that does not exist', () => {
    expect(movePhoto(ids, 9, -1)).toEqual(ids);
  });

  it('does not change the list it receives', () => {
    movePhoto(ids, 0, 1);

    expect(ids).toEqual(['a', 'b', 'c', 'd']);
  });
});
