import { describe, expect, it } from 'vitest';
import {
  CATEGORIES_SECTION,
  MATCHES_SECTION,
  isActiveSection,
  visibleSections,
} from './admin-sections';

describe('admin sections', () => {
  it('shows each person only the sections their permissions allow', () => {
    expect(visibleSections(['match:record-score']).map((section) => section.label)).toEqual([
      'Jogos',
    ]);
    expect(visibleSections(['team:manage', 'match:record-score'])).toHaveLength(2);
    expect(visibleSections(['photo:upload'])).toEqual([]);
  });

  it('keeps the section highlighted on its inner pages', () => {
    expect(isActiveSection('/admin/partidas/abc', MATCHES_SECTION)).toBe(true);
    expect(isActiveSection('/admin/categorias/abc/times/novo', CATEGORIES_SECTION)).toBe(true);
    expect(isActiveSection('/admin/times/abc', CATEGORIES_SECTION)).toBe(true);
  });

  it('does not highlight a section for a path that only looks similar', () => {
    expect(isActiveSection('/admin/categorias-antigas', CATEGORIES_SECTION)).toBe(false);
    expect(isActiveSection('/admin/categorias', MATCHES_SECTION)).toBe(false);
  });
});
