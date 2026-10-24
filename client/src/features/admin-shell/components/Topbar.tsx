import type { ReactElement } from 'react';
import { IconButton } from '@/components/ui/IconButton';

interface TopbarProps {
  title: string;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onOpenMenu: () => void;
}

const BUTTON_TONE = 'text-admin-ink hover:bg-admin-canvas';

export function Topbar({
  title,
  isSidebarCollapsed,
  onToggleSidebar,
  onOpenMenu,
}: TopbarProps): ReactElement {
  const toggleLabel = isSidebarCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral';
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-admin-line bg-admin-surface px-3">
      <div className="md:hidden">
        <IconButton icon="menu" label="Abrir menu" onClick={onOpenMenu} className={BUTTON_TONE} />
      </div>
      <div className="hidden md:block">
        <IconButton
          icon="panelLeft"
          label={toggleLabel}
          onClick={onToggleSidebar}
          ariaExpanded={!isSidebarCollapsed}
          className={BUTTON_TONE}
        />
      </div>
      <p className="truncate font-semibold">{title}</p>
    </header>
  );
}
