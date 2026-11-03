import type { ModalityCategories } from '@/features/admin-teams/types';
import { formatDayMonth, formatShortWeekday } from '@/features/games/lib/match-dates';

const NOON_IN_FORTALEZA = 'T12:00:00-03:00';

export interface DayOption {
  value: string;
  label: string;
}

export function buildDayOptions(days: string[]): DayOption[] {
  return days.map((value) => {
    const noon = new Date(`${value}${NOON_IN_FORTALEZA}`).toISOString();
    return { value, label: `${formatShortWeekday(noon)} ${formatDayMonth(noon)}` };
  });
}

export function findCategoryLabel(modalities: ModalityCategories[], categoryId: string): string {
  const categories = modalities.flatMap((modality) => modality.categories);
  return categories.find((category) => category.id === categoryId)?.label ?? '';
}
