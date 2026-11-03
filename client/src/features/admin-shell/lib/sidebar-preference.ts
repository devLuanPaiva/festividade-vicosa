export const SIDEBAR_COOKIE_NAME = 'admin-sidebar';
const COLLAPSED_VALUE = 'collapsed';
const EXPANDED_VALUE = 'expanded';
const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export function isSidebarCollapsed(cookieValue: string | undefined): boolean {
  return cookieValue === COLLAPSED_VALUE;
}

export function serializeSidebarPreference(isCollapsed: boolean): string {
  const value = isCollapsed ? COLLAPSED_VALUE : EXPANDED_VALUE;
  return `${SIDEBAR_COOKIE_NAME}=${value}; path=/; max-age=${ONE_YEAR_IN_SECONDS}; samesite=lax`;
}
