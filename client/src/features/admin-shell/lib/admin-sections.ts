import type { Permission } from '@/lib/auth/permissions';

export const ADMIN_MATCHES_PATH = '/admin';
export const ADMIN_CATEGORIES_PATH = '/admin/categorias';

export interface AdminSection {
  label: string;
  href: string;
  permission: Permission;
  exactPaths: string[];
  pathPrefixes: string[];
}

export const MATCHES_SECTION: AdminSection = {
  label: 'Jogos',
  href: ADMIN_MATCHES_PATH,
  permission: 'match:record-score',
  exactPaths: [ADMIN_MATCHES_PATH],
  pathPrefixes: ['/admin/partidas'],
};

export const CATEGORIES_SECTION: AdminSection = {
  label: 'Categorias',
  href: ADMIN_CATEGORIES_PATH,
  permission: 'team:manage',
  exactPaths: [],
  pathPrefixes: [ADMIN_CATEGORIES_PATH, '/admin/times'],
};

export const ADMIN_SECTIONS: AdminSection[] = [MATCHES_SECTION, CATEGORIES_SECTION];

function isInside(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function visibleSections(permissions: string[]): AdminSection[] {
  return ADMIN_SECTIONS.filter((section) => permissions.includes(section.permission));
}

export function isActiveSection(pathname: string, section: AdminSection): boolean {
  return (
    section.exactPaths.includes(pathname) ||
    section.pathPrefixes.some((prefix) => isInside(pathname, prefix))
  );
}
