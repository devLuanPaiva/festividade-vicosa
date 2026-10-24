export type CategoryTab = 'times' | 'grupos' | 'classificados' | 'partidas' | 'chaveamento';

export const DEFAULT_CATEGORY_TAB: CategoryTab = 'times';

const OPEN_TABS: CategoryTab[] = ['times', 'grupos', 'classificados'];
const MATCH_TABS: CategoryTab[] = ['partidas', 'chaveamento'];

export function parseCategoryTab(
  value: string | string[] | undefined,
  canManageMatches: boolean,
): CategoryTab {
  const matchTab = MATCH_TABS.find((tab) => tab === value);
  if (matchTab) {
    return canManageMatches ? matchTab : DEFAULT_CATEGORY_TAB;
  }
  return OPEN_TABS.find((tab) => tab === value) ?? DEFAULT_CATEGORY_TAB;
}
