import { useState } from 'react';
import { serializeSidebarPreference } from '../lib/sidebar-preference';

interface SidebarCollapse {
  isCollapsed: boolean;
  toggle: () => void;
}

export function useSidebarCollapse(initialCollapsed: boolean): SidebarCollapse {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);

  const toggle = (): void => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    document.cookie = serializeSidebarPreference(next);
  };

  return { isCollapsed, toggle };
}
