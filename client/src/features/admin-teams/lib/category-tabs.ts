export type CategoryTab = 'times' | 'grupos';

export const DEFAULT_CATEGORY_TAB: CategoryTab = 'times';

export function parseCategoryTab(value: string | string[] | undefined): CategoryTab {
  return value === 'grupos' ? 'grupos' : DEFAULT_CATEGORY_TAB;
}
