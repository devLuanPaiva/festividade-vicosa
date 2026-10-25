import { describe, expect, it } from 'vitest';
import { albumListPath, albumUploadPath } from './album-target';

const DAY = { kind: 'event-day', subEventId: 'sub-1', date: '2026-12-09' } as const;
const MATCH = { kind: 'match', matchId: 'match-1' } as const;

describe('album paths', () => {
  it('lists the photos of a day and uploads to its photos route', () => {
    expect(albumListPath(DAY)).toBe('/sub-events/sub-1/gallery/2026-12-09');
    expect(albumUploadPath(DAY)).toBe('/sub-events/sub-1/gallery/2026-12-09/photos');
  });

  it('uses the same route to list and to upload the photos of a match', () => {
    expect(albumListPath(MATCH)).toBe('/matches/match-1/photos');
    expect(albumUploadPath(MATCH)).toBe('/matches/match-1/photos');
  });

  it('does not let an identifier change the route', () => {
    const tampered = { kind: 'match', matchId: '../users' } as const;

    expect(albumListPath(tampered)).toBe('/matches/..%2Fusers/photos');
  });
});
