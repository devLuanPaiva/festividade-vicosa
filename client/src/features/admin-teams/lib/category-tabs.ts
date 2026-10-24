export type CategoryTab = 'times' | 'grupos' | 'classificados' | 'partidas';

export const DEFAULT_CATEGORY_TAB: CategoryTab = 'times';

const OPEN_TABS: CategoryTab[] = ['times', 'grupos', 'classificados'];

export function parseCategoryTab(
  value: string | string[] | undefined,
  canManageMatches: boolean,
): CategoryTab {
  if (value === 'partidas') {
    return canManageMatches ? 'partidas' : DEFAULT_CATEGORY_TAB;
  }
  return OPEN_TABS.find((tab) => tab === value) ?? DEFAULT_CATEGORY_TAB;
}
