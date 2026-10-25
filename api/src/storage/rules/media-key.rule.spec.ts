import {
  allVariantKeys,
  buildMediaBaseKey,
  isManagedMediaKey,
  MediaFolder,
  variantKey,
} from './media-key.rule';

const KEY = 'a1b2c3d4e5f6a7b8c9d0e1f2';

describe('buildMediaBaseKey', () => {
  it.each([
    {
      folder: MediaFolder.TEAM_PHOTO,
      segments: ['futsal-sub-15-masculino', 'centro'],
      expected: `teams/futsal-sub-15-masculino/centro/team-${KEY}`,
    },
    {
      folder: MediaFolder.MATCH_PHOTO,
      segments: ['futsal-sub-15-masculino', 'centro-x-acude-2026-12-09-1930'],
      expected: `matches/futsal-sub-15-masculino/centro-x-acude-2026-12-09-1930/photos/photo-${KEY}`,
    },
    {
      folder: MediaFolder.BEST_PLAYER,
      segments: ['futsal-sub-15-masculino', 'centro-x-acude-2026-12-09-1930'],
      expected: `matches/futsal-sub-15-masculino/centro-x-acude-2026-12-09-1930/best-player/best-player-${KEY}`,
    },
    {
      folder: MediaFolder.EVENT_PHOTO,
      segments: ['jocev-futsal', '2026-12-13'],
      expected: `sub-events/jocev-futsal/2026-12-13/photo-${KEY}`,
    },
    {
      folder: MediaFolder.HISTORY_PHOTO,
      segments: ['2026', 'primeira-festividade'],
      expected: `history/2026/primeira-festividade/photo-${KEY}`,
    },
  ])('puts $folder in readable folders with the standard name and the random key', (input) => {
    expect(buildMediaBaseKey(input, KEY)).toBe(input.expected);
  });

  it('never carries the name the file had on the phone', () => {
    const key = buildMediaBaseKey({ folder: MediaFolder.EVENT_PHOTO, segments: ['x', 'y'] }, KEY);

    expect(key).not.toMatch(/IMG|\.jpe?g|\.png/i);
  });

  it.each([[[]], [['../etc']], [['Centro']], [['centro/..']], [['a b']], [['']]])(
    'refuses the folders %j',
    (segments) => {
      expect(() => buildMediaBaseKey({ folder: MediaFolder.TEAM_PHOTO, segments }, KEY)).toThrow(
        'lowercase',
      );
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
    expect(isManagedMediaKey('teams/centro/team-k')).toBe(true);
    expect(isManagedMediaKey('https://commons.wikimedia.org/photo.jpg')).toBe(false);
    expect(isManagedMediaKey('teams/../secrets')).toBe(false);
  });
});
