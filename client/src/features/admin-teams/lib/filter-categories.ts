import type { ModalityCategories } from '../types';

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

export function filterCategories(
  modalities: ModalityCategories[],
  search: string,
): ModalityCategories[] {
  const wanted = normalize(search);
  if (wanted === '') {
    return modalities;
  }
  return modalities
    .map((modality) => ({
      ...modality,
      categories: modality.categories.filter((category) =>
        normalize(`${modality.modalityLabel} ${category.label}`).includes(wanted),
      ),
    }))
    .filter((modality) => modality.categories.length > 0);
}
