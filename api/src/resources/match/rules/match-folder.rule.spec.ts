import { matchFolderName } from './match-folder.rule';

describe('matchFolderName', () => {
  it('names the folder after the teams and the local date and time of the game', () => {
    expect(
      matchFolderName({
        teamASlug: 'centro',
        teamBSlug: 'acude',
        scheduledAt: new Date('2026-12-09T19:30:00-03:00'),
      }),
    ).toBe('centro-x-acude-2026-12-09-1930');
  });

  it('uses the time in Fortaleza, not in UTC', () => {
    const lateNight = new Date('2026-12-10T01:15:00Z');

    expect(matchFolderName({ teamASlug: 'a', teamBSlug: 'b', scheduledAt: lateNight })).toBe(
      'a-x-b-2026-12-09-2215',
    );
  });

  it('writes midnight as 0000 and not as 2400', () => {
    expect(
      matchFolderName({
        teamASlug: 'a',
        teamBSlug: 'b',
        scheduledAt: new Date('2026-12-09T00:00:00-03:00'),
      }),
    ).toBe('a-x-b-2026-12-09-0000');
  });
});
