export type CategoryTab = 'times' | 'grupos' | 'partidas';

export const DEFAULT_CATEGORY_TAB: CategoryTab = 'times';

export function parseCategoryTab(
  value: string | string[] | undefined,
  canManageMatches: boolean,
): CategoryTab {
  if (value === 'grupos') {
    return 'grupos';
  }
  return value === 'partidas' && canManageMatches ? 'partidas' : DEFAULT_CATEGORY_TAB;
}
