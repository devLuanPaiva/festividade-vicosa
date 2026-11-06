import Link from 'next/link';
import type { ReactElement } from 'react';
import { ADMIN_USERS_PATH } from '@/features/admin-shell/lib/admin-sections';
import { PERMISSIONS_PATH, ROLES_PATH } from '../lib/user-paths';

export type UsersArea = 'users' | 'roles' | 'permissions';

const TABS: { area: UsersArea; label: string; href: string }[] = [
  { area: 'users', label: 'Usuários', href: ADMIN_USERS_PATH },
  { area: 'roles', label: 'Grupos', href: ROLES_PATH },
  { area: 'permissions', label: 'Permissões', href: PERMISSIONS_PATH },
];

interface UsersAreaTabsProps {
  active: UsersArea;
}

export function UsersAreaTabs({ active }: Readonly<UsersAreaTabsProps>): ReactElement {
  return (
    <nav
      aria-label="Seções de usuários e acessos"
      className="flex gap-1 border-b border-admin-line"
    >
      {TABS.map((tab) => {
        const isActive = tab.area === active;
        return (
          <Link
            key={tab.area}
            href={tab.href}
            aria-current={isActive ? 'page' : undefined}
            className={`inline-flex min-h-11 items-center border-b-2 px-4 text-sm font-semibold ${
              isActive
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-admin-muted hover:text-admin-ink'
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
