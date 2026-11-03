import { containsText } from './text-search';

describe('containsText', () => {
  it('matches the text anywhere, ignoring case', () => {
    expect(containsText('centro')).toMatchObject({ _type: 'ilike', _value: '%centro%' });
  });

  it('trims the text', () => {
    expect(containsText('  centro ')).toMatchObject({ _value: '%centro%' });
  });

  it('escapes the LIKE wildcards and the backslash so they match literally', () => {
    expect(containsText('50%_a\\b')).toMatchObject({ _value: '%50\\%\\_a\\\\b%' });
  });
});
