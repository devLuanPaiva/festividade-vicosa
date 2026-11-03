import { normalizeSearch } from '@/lib/text/normalize-search';
import type { ModalityCategories } from '../types';

export function filterCategories(
  modalities: ModalityCategories[],
  search: string,
): ModalityCategories[] {
  const wanted = normalizeSearch(search);
  if (wanted === '') {
    return modalities;
  }
  return modalities
    .map((modality) => ({
      ...modality,
      categories: modality.categories.filter((category) =>
        normalizeSearch(`${modality.modalityLabel} ${category.label}`).includes(wanted),
      ),
    }))
    .filter((modality) => modality.categories.length > 0);
}
