import {
  allVariantKeys,
  buildMediaBaseKey,
  isManagedMediaKey,
  MediaFolder,
  variantKey,
} from './media-key.rule';

const OWNER = '3f2a6b1c-9d4e-4f70-8a15-0c2b7e9d1a44';
const KEY = 'a1b2c3d4e5f6a7b8c9d0e1f2';

describe('buildMediaBaseKey', () => {
  it.each([
    [{ folder: MediaFolder.TEAM_PHOTO }, `teams/${OWNER}/team-${KEY}`],
    [{ folder: MediaFolder.MATCH_PHOTO }, `matches/${OWNER}/photos/photo-${KEY}`],
    [{ folder: MediaFolder.BEST_PLAYER }, `matches/${OWNER}/best-player/best-player-${KEY}`],
    [
      { folder: MediaFolder.EVENT_PHOTO, day: '2026-12-13' },
      `sub-events/${OWNER}/2026-12-13/photo-${KEY}`,
    ],
    [{ folder: MediaFolder.HISTORY_PHOTO }, `history/${OWNER}/photo-${KEY}`],
  ])('puts %j in its own folder with the standard name and the random key', (target, expected) => {
    expect(buildMediaBaseKey({ ownerId: OWNER, ...target }, KEY)).toBe(expected);
  });

  it('never carries the name the file had on the phone', () => {
    const key = buildMediaBaseKey({ folder: MediaFolder.MATCH_PHOTO, ownerId: OWNER }, KEY);

    expect(key).not.toMatch(/IMG|\.jpe?g|\.png/i);
  });

  it.each(['../etc', 'abc', `${OWNER}/..`, ''])('refuses %j as the owner of a file', (ownerId) => {
    expect(() => buildMediaBaseKey({ folder: MediaFolder.TEAM_PHOTO, ownerId }, KEY)).toThrow(
      'UUID',
    );
  });

  it.each([undefined, '13/12/2026', '2026-12-13/../x'])(
    'asks for a well written day on a gallery photo (%j)',
    (day) => {
      expect(() =>
        buildMediaBaseKey({ folder: MediaFolder.EVENT_PHOTO, ownerId: OWNER, day }, KEY),
      ).toThrow('YYYY-MM-DD');
    },
  );
});

describe('variants', () => {
  it('names each size after the same base key, always as webp', () => {
    expect(variantKey('teams/x/team-k', 'thumb')).toBe('teams/x/team-k-thumb.webp');
    expect(allVariantKeys('teams/x/team-k')).toEqual([
      'teams/x/team-k-thumb.webp',
      'teams/x/team-k-medium.webp',
      'teams/x/team-k-large.webp',
    ]);
  });
});

describe('isManagedMediaKey', () => {
  it('tells keys written by the API from the address of an external image', () => {
    expect(isManagedMediaKey(`teams/${OWNER}/team-${KEY}`)).toBe(true);
    expect(isManagedMediaKey('https://upload.wikimedia.org/photo.jpg')).toBe(false);
    expect(isManagedMediaKey('photos/abc')).toBe(false);
  });

  it('never trusts a key that tries to leave its folder', () => {
    expect(isManagedMediaKey('teams/../secrets/file')).toBe(false);
  });
});
