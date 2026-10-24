import { describe, expect, it } from 'vitest';
import { parseCategoryTab } from './category-tabs';

describe('parseCategoryTab', () => {
  it('opens the groups tab only when asked, and falls back to teams for anything else', () => {
    expect(parseCategoryTab('grupos')).toBe('grupos');
    expect(parseCategoryTab('times')).toBe('times');
    expect(parseCategoryTab(undefined)).toBe('times');
    expect(parseCategoryTab('qualquer-coisa')).toBe('times');
    expect(parseCategoryTab(['grupos', 'times'])).toBe('times');
  });
});
