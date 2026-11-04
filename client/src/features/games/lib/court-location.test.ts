import { describe, expect, it } from 'vitest';
import { courtLocationLabel, parseCourtLocation } from './court-location';

describe('parseCourtLocation', () => {
  it.each([
    ['SQUARE_1', 'SQUARE_1'],
    ['GYMNASIUM', 'GYMNASIUM'],
    ['', null],
    ['Ginásio', null],
  ])('reads %p as %p', (value, expected) => {
    expect(parseCourtLocation(value)).toBe(expected);
  });
});

describe('courtLocationLabel', () => {
  it('names each court in Portuguese and leaves an undefined location empty', () => {
    expect(courtLocationLabel('SQUARE_2')).toBe('Praça 2');
    expect(courtLocationLabel('GYMNASIUM')).toBe('Ginásio');
    expect(courtLocationLabel(null)).toBeNull();
  });
});
