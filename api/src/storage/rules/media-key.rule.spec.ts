import { buildMediaKey, isManagedMediaKey, MediaFolder, objectKeysOf } from './media-key.rule';

const KEY = 'a1b2c3d4e5f6a7b8c9d0e1f2';

describe('buildMediaKey', () => {
  it.each([
    {
      folder: MediaFolder.TEAM_PHOTO,
      segments: ['futsal-sub-15-masculino', 'centro'],
      expected: `teams/futsal-sub-15-masculino/centro/team-${KEY}.webp`,
    },
    {
      folder: MediaFolder.MATCH_PHOTO,
      segments: ['futsal-sub-15-masculino', 'centro-x-acude-2026-12-09-1930'],
      expected: `matches/futsal-sub-15-masculino/centro-x-acude-2026-12-09-1930/photos/photo-${KEY}.webp`,
    },
    {
      folder: MediaFolder.BEST_PLAYER,
      segments: ['futsal-sub-15-masculino', 'centro-x-acude-2026-12-09-1930'],
      expected: `matches/futsal-sub-15-masculino/centro-x-acude-2026-12-09-1930/best-player/best-player-${KEY}.webp`,
    },
    {
      folder: MediaFolder.EVENT_PHOTO,
      segments: ['jocev-handball', '2026-12-04'],
      expected: `sub-events/jocev-handball/2026-12-04/photo-${KEY}.webp`,
    },
    {
      folder: MediaFolder.HISTORY_PHOTO,
      segments: ['2026', 'primeira-festividade'],
      expected: `history/2026/primeira-festividade/photo-${KEY}.webp`,
    },
  ])('names the one file of $folder after its folders, the standard name and the key', (input) => {
    expect(buildMediaKey(input, KEY)).toBe(input.expected);
  });

  it('never carries the name the file had on the phone', () => {
    const key = buildMediaKey({ folder: MediaFolder.EVENT_PHOTO, segments: ['x', 'y'] }, KEY);

    expect(key).not.toMatch(/IMG|\.jpe?g|\.png/i);
  });

  it.each([[[]], [['../etc']], [['Centro']], [['centro/..']], [['a b']], [['']]])(
    'refuses the folders %j',
    (segments) => {
      expect(() => buildMediaKey({ folder: MediaFolder.TEAM_PHOTO, segments }, KEY)).toThrow(
        'lowercase',
      );
    },
  );
});

describe('objectKeysOf', () => {
  it('is the file itself for a photo saved as one file', () => {
    expect(objectKeysOf('teams/x/team-k.webp')).toEqual(['teams/x/team-k.webp']);
  });

  it('lists the three sizes of a photo saved before the single file', () => {
    expect(objectKeysOf('teams/x/team-k')).toEqual([
      'teams/x/team-k-thumb.webp',
      'teams/x/team-k-medium.webp',
      'teams/x/team-k-large.webp',
    ]);
  });
});

describe('isManagedMediaKey', () => {
  it('tells keys written by the API from the address of an external image', () => {
    expect(isManagedMediaKey('teams/centro/team-k.webp')).toBe(true);
    expect(isManagedMediaKey('https://commons.wikimedia.org/photo.jpg')).toBe(false);
    expect(isManagedMediaKey('teams/../secrets')).toBe(false);
  });
});
