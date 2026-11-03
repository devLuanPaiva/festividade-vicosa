import { describe, expect, it } from 'vitest';
import { diffOverrides, parseOverrideChoices } from './override-changes';

describe('diffOverrides', () => {
  it('asks for nothing when the choices match what is saved', () => {
    expect(
      diffOverrides([{ permission: 'photo:delete', effect: 'GRANTED' }], {
        'photo:delete': 'GRANTED',
        'photo:upload': 'INHERIT',
      }),
    ).toEqual([]);
  });

  it('sets a new grant or revoke and replaces a changed one', () => {
    expect(
      diffOverrides([{ permission: 'photo:delete', effect: 'GRANTED' }], {
        'photo:delete': 'REVOKED',
        'photo:upload': 'GRANTED',
      }),
    ).toEqual([
      { permission: 'photo:delete', effect: 'REVOKED' },
      { permission: 'photo:upload', effect: 'GRANTED' },
    ]);
  });

  it('removes the individual setting when the person goes back to the group', () => {
    expect(
      diffOverrides([{ permission: 'photo:delete', effect: 'REVOKED' }], {
        'photo:delete': 'INHERIT',
      }),
    ).toEqual([{ permission: 'photo:delete', effect: null }]);
  });
});

describe('parseOverrideChoices', () => {
  it('reads one choice per permission and treats anything unknown as the group default', () => {
    const formData = new FormData();
    formData.set('override:photo:delete', 'REVOKED');
    formData.set('override:photo:upload', 'qualquer');

    expect(parseOverrideChoices(formData, ['photo:delete', 'photo:upload', 'team:manage'])).toEqual(
      {
        'photo:delete': 'REVOKED',
        'photo:upload': 'INHERIT',
        'team:manage': 'INHERIT',
      },
    );
  });
});
