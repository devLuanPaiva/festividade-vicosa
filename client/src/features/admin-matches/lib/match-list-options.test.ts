import { describe, expect, it } from 'vitest';
import type { ModalityCategories } from '@/features/admin-teams/types';
import type { MatchListItem } from '@/features/games/types';
import { buildDayOptions, findCategoryLabel } from './match-list-options';

function matchAt(scheduledAt: string): MatchListItem {
  return { scheduledAt } as MatchListItem;
}

describe('buildDayOptions', () => {
  it('lists each local day once, in order, with weekday and date', () => {
    const options = buildDayOptions([
      matchAt('2026-12-05T11:00:00.000Z'),
      matchAt('2026-12-04T11:00:00.000Z'),
      matchAt('2026-12-04T18:00:00.000Z'),
      matchAt('2026-12-06T02:30:00.000Z'),
    ]);

    expect(options).toEqual([
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
