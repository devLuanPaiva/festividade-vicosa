import type { PermissionDescription } from '../types';

const RESOURCE_LABELS: Record<string, string> = {
  schedule: 'Programação',
  team: 'Campeonato',
  match: 'Partidas',
  photo: 'Galeria',
  history: 'História',
  user: 'Usuários e acessos',
};

const RESOURCE_SEPARATOR = ':';

export interface PermissionSection {
  resource: string;
  label: string;
  permissions: PermissionDescription[];
}

export function resourceOf(permissionCode: string): string {
  return permissionCode.split(RESOURCE_SEPARATOR)[0] ?? permissionCode;
}

export function groupByResource(catalog: PermissionDescription[]): PermissionSection[] {
  const sections = new Map<string, PermissionSection>();
  for (const permission of catalog) {
    const resource = resourceOf(permission.code);
    const section = sections.get(resource) ?? {
      resource,
      label: RESOURCE_LABELS[resource] ?? resource,
      permissions: [],
    };
    sections.set(resource, { ...section, permissions: [...section.permissions, permission] });
  }
  return [...sections.values()];
}
