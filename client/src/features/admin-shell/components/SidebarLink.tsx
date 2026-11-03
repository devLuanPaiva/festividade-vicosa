import Link from 'next/link';
import type { ReactElement } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Tooltip } from '@/components/ui/Tooltip';
import type { AdminSection } from '../lib/admin-sections';

interface SidebarLinkProps {
  section: AdminSection;
  isActive: boolean;
  isCollapsed: boolean;
  onNavigate?: () => void;
}

export function SidebarLink({
  section,
  isActive,
  isCollapsed,
  onNavigate,
}: SidebarLinkProps): ReactElement {
  const tone = isActive
    ? 'bg-white/15 text-white shadow-[inset_3px_0_0_var(--color-sun)]'
    : 'text-white/75 hover:bg-white/10 hover:text-white';
  const layout = isCollapsed ? 'justify-center px-0' : 'px-3';
  return (
    <Tooltip label={section.label} side="right" isDisabled={!isCollapsed} className="w-full">
      <Link
        href={section.href}
        onClick={onNavigate}
        aria-current={isActive ? 'page' : undefined}
        className={`flex min-h-11 w-full items-center gap-3 rounded-xl font-semibold transition-colors ${layout} ${tone}`}
      >
        <Icon name={section.icon} className="size-5 shrink-0" />
        <span className={isCollapsed ? 'sr-only' : 'truncate'}>{section.label}</span>
      </Link>
    </Tooltip>
  );
}
