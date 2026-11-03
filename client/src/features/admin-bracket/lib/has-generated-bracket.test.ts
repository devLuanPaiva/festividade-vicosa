import { describe, expect, it } from 'vitest';
import type { Match } from '@/features/games/types';
import { hasGeneratedBracket } from './has-generated-bracket';

function match(overrides: Partial<Match>): Match {
  return { stage: 'GROUP', bracketPosition: null, ...overrides } as Match;
}

describe('hasGeneratedBracket', () => {
  it('is true when some match came from a generated bracket', () => {
    expect(hasGeneratedBracket([match({}), match({ stage: 'KNOCKOUT', bracketPosition: 1 })])).toBe(
      true,
    );
  });

  it('is false for hand-made knockout matches, which stay outside the bracket (RN-27)', () => {
    expect(hasGeneratedBracket([match({ stage: 'KNOCKOUT', bracketPosition: null })])).toBe(false);
  });

  it('is false for a category with no matches', () => {
    expect(hasGeneratedBracket([])).toBe(false);
  });
});
