import { describe, expect, it } from 'vitest';
import { parseTeamForm, toTeamPayload } from './parse-team-form';

function formWith(fields: Record<string, string>): FormData {
  const formData = new FormData();
  Object.entries(fields).forEach(([name, value]) => formData.set(name, value));
  return formData;
}

describe('team form', () => {
  it('trims what was typed so a name with stray spaces is not rejected as duplicate', () => {
    const values = parseTeamForm(formWith({ name: '  Gaviões  ', city: ' Viçosa ' }));

    expect(values).toMatchObject({ name: 'Gaviões', city: 'Viçosa' });
  });

  it('sends empty optional fields as null, which is how the api clears them', () => {
    const payload = toTeamPayload(
      parseTeamForm(formWith({ name: 'Gaviões', city: 'Viçosa', abbreviation: '', groupId: '' })),
    );

    expect(payload).toEqual({
      name: 'Gaviões',
      city: 'Viçosa',
      abbreviation: null,
      groupId: null,
    });
  });

  it('keeps the abbreviation and the chosen group when they are filled in', () => {
    const payload = toTeamPayload(
      parseTeamForm(formWith({ name: 'G', city: 'V', abbreviation: 'GAV', groupId: 'group-1' })),
    );

    expect(payload).toMatchObject({ abbreviation: 'GAV', groupId: 'group-1' });
  });

  it('reads missing fields as empty text instead of failing', () => {
    expect(parseTeamForm(new FormData())).toEqual({
      name: '',
      city: '',
      abbreviation: '',
      groupId: '',
    });
  });
});
