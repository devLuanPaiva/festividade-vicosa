'use client';

import { usePathname } from 'next/navigation';
import type { ReactElement, ReactNode } from 'react';
import { useMobileDrawer } from '../hooks/use-mobile-drawer';
import { useSidebarCollapse } from '../hooks/use-sidebar-collapse';
import { activeSectionLabel, visibleSections } from '../lib/admin-sections';
import type { ShellUser } from '../types';
import { MobileDrawer } from './MobileDrawer';
import { SidebarContent } from './SidebarContent';
import { Topbar } from './Topbar';

export const MAIN_CONTENT_ID = 'conteudo';

interface ShellFrameProps {
  user: ShellUser;
  initialCollapsed: boolean;
  children: ReactNode;
}

export function ShellFrame({ user, initialCollapsed, children }: ShellFrameProps): ReactElement {
  const pathname = usePathname();
  const { isCollapsed, toggle } = useSidebarCollapse(initialCollapsed);
  const drawer = useMobileDrawer(pathname);
  const title = activeSectionLabel(pathname, visibleSections(user.permissions));
  const width = isCollapsed ? 'md:w-[72px]' : 'md:w-64';

  return (
    <div className="flex min-h-dvh">
      <a
        href={`#${MAIN_CONTENT_ID}`}
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-xl focus:bg-white focus:px-4 focus:py-3 focus:font-semibold"
      >
        Pular para o conteúdo
      </a>
      <aside
        className={`sticky top-0 hidden h-dvh shrink-0 bg-brand-900 text-white transition-[width] duration-200 motion-reduce:transition-none md:block ${width}`}
      >
        <SidebarContent user={user} isCollapsed={isCollapsed} />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          title={title}
          isSidebarCollapsed={isCollapsed}
          onToggleSidebar={toggle}
          onOpenMenu={drawer.open}
        />
        <main
          id={MAIN_CONTENT_ID}
          className="mx-auto flex w-[92%] max-w-[1280px] flex-1 flex-col gap-6 py-6"
        >
          {children}
        </main>
      </div>
      <MobileDrawer dialogRef={drawer.dialogRef} user={user} onClose={drawer.close} />
    </div>
  );
}
