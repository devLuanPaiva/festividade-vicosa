'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactElement, ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { ADMIN_HOME_PATH } from '@/lib/auth/auth-paths';
import { isActiveSection, visibleSections } from '../lib/admin-sections';
import type { ShellUser } from '../types';
import { SidebarLink } from './SidebarLink';
import { SidebarUser } from './SidebarUser';

interface SidebarContentProps {
  user: ShellUser;
  isCollapsed: boolean;
  onNavigate?: () => void;
  headerAction?: ReactNode;
}

function Brand({ isCollapsed }: { isCollapsed: boolean }): ReactElement {
  return (
    <Link
      href={ADMIN_HOME_PATH}
      className="flex min-h-14 min-w-0 flex-1 items-center gap-3 px-3 text-white"
      aria-label="Painel da Festividade, ir para o início"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sun text-brand-900">
        <Icon name="ball" className="size-6" />
      </span>
      {isCollapsed ? null : (
        <span className="font-display text-2xl leading-none tracking-wide">
          Painel da Festividade
        </span>
      )}
    </Link>
  );
}

export function SidebarContent({
  user,
  isCollapsed,
  onNavigate,
  headerAction,
}: SidebarContentProps): ReactElement {
  const pathname = usePathname();
  const sections = visibleSections(user.permissions);
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center">
        <Brand isCollapsed={isCollapsed} />
        {headerAction}
      </div>
      <nav aria-label="Seções do painel" className="flex flex-1 flex-col gap-1 p-3">
        {sections.map((section) => (
          <SidebarLink
            key={section.href}
            section={section}
            isActive={isActiveSection(pathname, section)}
            isCollapsed={isCollapsed}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
      <SidebarUser user={user} isCollapsed={isCollapsed} />
    </div>
  );
}
