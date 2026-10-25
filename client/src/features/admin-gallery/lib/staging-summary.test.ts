import { describe, expect, it } from 'vitest';
import type { StagedPhoto, StagedStatus } from '../types';
import { summarizeStaging } from './staging-summary';

function photos(...statuses: StagedStatus[]): StagedPhoto[] {
  return statuses.map((status, id) => ({
    id,
    file: new File(['x'], `${id}.jpg`),
    status,
    message: null,
  }));
}

describe('summarizeStaging', () => {
  it('counts a photo as finished once it was sent or failed', () => {
    expect(summarizeStaging(photos('done', 'failed', 'uploading', 'waiting'))).toEqual({
      total: 4,
      finished: 2,
      failed: 1,
      percent: 50,
    });
  });

  it('is empty before anything is chosen', () => {
    expect(summarizeStaging([])).toEqual({ total: 0, finished: 0, failed: 0, percent: 0 });
  });

  it('reaches 100 percent when every photo is done', () => {
    expect(summarizeStaging(photos('done', 'done')).percent).toBe(100);
  });
});
