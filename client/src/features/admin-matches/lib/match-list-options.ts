import type { ModalityCategories } from '@/features/admin-teams/types';
import { formatDayMonth, formatShortWeekday, toDayKey } from '@/features/games/lib/match-dates';
import type { MatchListItem } from '@/features/games/types';

export interface DayOption {
  value: string;
  label: string;
}

export function buildDayOptions(matches: MatchListItem[]): DayOption[] {
  const firstMatchOfDay = new Map<string, string>();
  for (const { scheduledAt } of matches) {
    const day = toDayKey(scheduledAt);
    if (!firstMatchOfDay.has(day)) {
      firstMatchOfDay.set(day, scheduledAt);
    }
  }
  return [...firstMatchOfDay.entries()]
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([value, scheduledAt]) => ({
      value,
      label: `${formatShortWeekday(scheduledAt)} ${formatDayMonth(scheduledAt)}`,
    }));
}

export function findCategoryLabel(modalities: ModalityCategories[], categoryId: string): string {
  const categories = modalities.flatMap((modality) => modality.categories);
  return categories.find((category) => category.id === categoryId)?.label ?? '';
}
