import { describe, expect, it } from 'vitest';
import type { ModalityCategories } from '@/features/admin-teams/types';
import { buildDayOptions, findCategoryLabel } from './match-list-options';

describe('buildDayOptions', () => {
  it('writes weekday and date for each day the API sent, keeping its order', () => {
    expect(buildDayOptions(['2026-12-04', '2026-12-05'])).toEqual([
      { value: '2026-12-04', label: 'sex 04/12' },
      { value: '2026-12-05', label: 'sáb 05/12' },
    ]);
  });

  it('has no options before any match exists', () => {
    expect(buildDayOptions([])).toEqual([]);
  });
});

describe('findCategoryLabel', () => {
  const modalities: ModalityCategories[] = [
    { modalityLabel: 'Futsal', categories: [{ id: 'c1', label: 'Adulto Masculino' }] },
    { modalityLabel: 'Handebol', categories: [{ id: 'c2', label: 'Cadete Feminino' }] },
  ];

  it('finds the label in any modality and is empty for an unknown category', () => {
    expect(findCategoryLabel(modalities, 'c2')).toBe('Cadete Feminino');
    expect(findCategoryLabel(modalities, 'nope')).toBe('');
  });
});
