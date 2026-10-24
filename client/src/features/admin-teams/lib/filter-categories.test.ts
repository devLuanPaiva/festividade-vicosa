import { describe, expect, it } from 'vitest';
import type { ModalityCategories } from '../types';
import { filterCategories } from './filter-categories';

const MODALITIES: ModalityCategories[] = [
  {
    modalityLabel: 'Futsal',
    categories: [
      { id: '1', label: 'Adulto Masculino' },
      { id: '2', label: 'Júnior Feminino' },
    ],
  },
  { modalityLabel: 'Handebol', categories: [{ id: '3', label: 'Adulto Feminino' }] },
];

function idsOf(result: ModalityCategories[]): string[] {
  return result.flatMap((modality) => modality.categories.map((category) => category.id));
}

describe('filterCategories', () => {
  it('returns everything for an empty search', () => {
    expect(filterCategories(MODALITIES, '   ')).toBe(MODALITIES);
  });

  it('ignores accents and letter case', () => {
    expect(idsOf(filterCategories(MODALITIES, 'JUNIOR'))).toEqual(['2']);
  });

  it('finds a category by its modality too, and drops modalities without matches', () => {
    const result = filterCategories(MODALITIES, 'handebol');

    expect(idsOf(result)).toEqual(['3']);
    expect(result.map((modality) => modality.modalityLabel)).toEqual(['Handebol']);
  });

  it('returns nothing when no category matches', () => {
    expect(filterCategories(MODALITIES, 'vôlei')).toEqual([]);
  });
});
