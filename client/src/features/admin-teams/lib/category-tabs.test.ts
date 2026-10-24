import { describe, expect, it } from 'vitest';
import { parseCategoryTab } from './category-tabs';

describe('parseCategoryTab', () => {
  it('opens the groups tab only when asked, and falls back to teams for anything else', () => {
    expect(parseCategoryTab('grupos', true)).toBe('grupos');
    expect(parseCategoryTab('times', true)).toBe('times');
    expect(parseCategoryTab(undefined, true)).toBe('times');
    expect(parseCategoryTab('qualquer-coisa', true)).toBe('times');
    expect(parseCategoryTab(['grupos', 'times'], true)).toBe('times');
  });

  it('opens the qualified tab when asked', () => {
    expect(parseCategoryTab('classificados', false)).toBe('classificados');
  });

  it('opens the matches tab only for who can manage matches', () => {
    expect(parseCategoryTab('partidas', true)).toBe('partidas');
    expect(parseCategoryTab('partidas', false)).toBe('times');
  });
});
