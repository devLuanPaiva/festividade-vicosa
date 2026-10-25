import type { IconName } from '@/components/ui/Icon';
import { ADMIN_HOME_PATH } from '@/lib/auth/auth-paths';
import type { Permission } from '@/lib/auth/permissions';

const PANEL_LABEL = 'Painel';

export const ADMIN_MATCHES_PATH = '/admin/partidas';
export const ADMIN_CATEGORIES_PATH = '/admin/categorias';
export const ADMIN_GALLERY_PATH = '/admin/galeria';

export interface AdminSection {
  label: string;
  icon: IconName;
  href: string;
  permission: Permission | null;
  exactPaths: string[];
  pathPrefixes: string[];
}

export const HOME_SECTION: AdminSection = {
  label: 'Início',
  icon: 'home',
  href: ADMIN_HOME_PATH,
  permission: null,
  exactPaths: [ADMIN_HOME_PATH],
  pathPrefixes: [],
};

export const MATCHES_SECTION: AdminSection = {
  label: 'Partidas',
  icon: 'calendar',
  href: ADMIN_MATCHES_PATH,
  permission: 'match:record-score',
  exactPaths: [],
  pathPrefixes: [ADMIN_MATCHES_PATH],
};

export const CATEGORIES_SECTION: AdminSection = {
  label: 'Campeonato',
  icon: 'trophy',
  href: ADMIN_CATEGORIES_PATH,
  permission: 'team:manage',
  exactPaths: [],
  pathPrefixes: [ADMIN_CATEGORIES_PATH, '/admin/times'],
};

export const GALLERY_SECTION: AdminSection = {
  label: 'Galeria',
  icon: 'image',
  href: ADMIN_GALLERY_PATH,
  permission: 'photo:upload',
  exactPaths: [],
  pathPrefixes: [ADMIN_GALLERY_PATH],
};

export const ADMIN_SECTIONS: AdminSection[] = [
  HOME_SECTION,
  MATCHES_SECTION,
  CATEGORIES_SECTION,
  GALLERY_SECTION,
];

function isInside(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function visibleSections(permissions: string[]): AdminSection[] {
  return ADMIN_SECTIONS.filter(
    (section) => section.permission === null || permissions.includes(section.permission),
  );
}

export function isActiveSection(pathname: string, section: AdminSection): boolean {
  return (
    section.exactPaths.includes(pathname) ||
    section.pathPrefixes.some((prefix) => isInside(pathname, prefix))
  );
}

export function activeSectionLabel(pathname: string, sections: AdminSection[]): string {
  return sections.find((section) => isActiveSection(pathname, section))?.label ?? PANEL_LABEL;
}
