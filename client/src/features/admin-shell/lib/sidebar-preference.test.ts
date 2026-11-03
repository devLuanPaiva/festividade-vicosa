import { describe, expect, it } from 'vitest';
import { isSidebarCollapsed, serializeSidebarPreference } from './sidebar-preference';

describe('sidebar preference', () => {
  it('starts expanded unless the saved choice says collapsed', () => {
    expect(isSidebarCollapsed('collapsed')).toBe(true);
    expect(isSidebarCollapsed('expanded')).toBe(false);
    expect(isSidebarCollapsed(undefined)).toBe(false);
    expect(isSidebarCollapsed('qualquer-coisa')).toBe(false);
  });

  it('saves the choice for the whole panel for a year, so it survives a reload', () => {
    const cookie = serializeSidebarPreference(true);

    expect(cookie).toContain('admin-sidebar=collapsed');
    expect(cookie).toContain('path=/');
    expect(cookie).toContain(`max-age=${60 * 60 * 24 * 365}`);
  });
});
