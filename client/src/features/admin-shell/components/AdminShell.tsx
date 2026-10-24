import { cookies } from 'next/headers';
import type { ReactElement, ReactNode } from 'react';
import { requireCurrentUser } from '@/lib/auth/current-user';
import { isSidebarCollapsed, SIDEBAR_COOKIE_NAME } from '../lib/sidebar-preference';
import { ShellFrame } from './ShellFrame';

interface AdminShellProps {
  children: ReactNode;
}

export async function AdminShell({ children }: AdminShellProps): Promise<ReactElement> {
  const [user, cookieStore] = await Promise.all([requireCurrentUser(), cookies()]);
  const initialCollapsed = isSidebarCollapsed(cookieStore.get(SIDEBAR_COOKIE_NAME)?.value);
  return (
    <ShellFrame
      user={{ name: user.name, email: user.email, permissions: user.permissions }}
      initialCollapsed={initialCollapsed}
    >
      {children}
    </ShellFrame>
  );
}
