import { describe, expect, it } from 'vitest';
import { toInitials } from './user-initials';

describe('toInitials', () => {
  it.each([
    ['Luan Paiva', 'LP'],
    ['maria', 'M'],
    ['  Ana   Clara  Souza ', 'AC'],
    ['', '?'],
  ])('turns %j into %j', (name, expected) => {
    expect(toInitials(name)).toBe(expected);
  });
});
