import { describe, expect, it } from 'vitest';
import {
  ADMIN_SECTIONS,
  CATEGORIES_SECTION,
  HOME_SECTION,
  MATCHES_SECTION,
  activeSectionLabel,
  isActiveSection,
  visibleSections,
} from './admin-sections';

function labelsFor(permissions: string[]): string[] {
  return visibleSections(permissions).map((section) => section.label);
}

describe('admin sections', () => {
  it('always shows the home, then only what each person is allowed to use', () => {
    expect(labelsFor([])).toEqual(['Início']);
    expect(labelsFor(['photo:upload'])).toEqual(['Início']);
    expect(labelsFor(['match:record-score'])).toEqual(['Início', 'Partidas']);
    expect(labelsFor(['team:manage', 'match:record-score'])).toEqual([
      'Início',
      'Partidas',
      'Campeonato',
    ]);
  });

  it('keeps the section highlighted on its inner pages', () => {
    expect(isActiveSection('/admin/partidas/abc', MATCHES_SECTION)).toBe(true);
    expect(isActiveSection('/admin/categorias/abc/times/novo', CATEGORIES_SECTION)).toBe(true);
    expect(isActiveSection('/admin/times/abc', CATEGORIES_SECTION)).toBe(true);
  });

  it('highlights the home only on the home itself', () => {
    expect(isActiveSection('/admin', HOME_SECTION)).toBe(true);
    expect(isActiveSection('/admin/partidas', HOME_SECTION)).toBe(false);
    expect(isActiveSection('/admin/categorias', HOME_SECTION)).toBe(false);
  });

  it('does not highlight a section for a path that only looks similar', () => {
    expect(isActiveSection('/admin/categorias-antigas', CATEGORIES_SECTION)).toBe(false);
    expect(isActiveSection('/admin/categorias', MATCHES_SECTION)).toBe(false);
  });
});

describe('activeSectionLabel', () => {
  it('names the section the person is in, also on its inner pages', () => {
    expect(activeSectionLabel('/admin/categorias/abc/partidas/nova', ADMIN_SECTIONS)).toBe(
      'Campeonato',
    );
    expect(activeSectionLabel('/admin', ADMIN_SECTIONS)).toBe('Início');
    expect(activeSectionLabel('/admin/partidas/abc', ADMIN_SECTIONS)).toBe('Partidas');
  });

  it('falls back to a generic name outside any section', () => {
    expect(activeSectionLabel('/admin/outra', ADMIN_SECTIONS)).toBe('Painel');
  });
});
