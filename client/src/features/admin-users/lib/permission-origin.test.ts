import { describe, expect, it } from 'vitest';
import type { AdminRole, PermissionOverride } from '../types';
import { describePermissionRows, type PermissionRow } from './permission-origin';

const CATALOG = [{ code: 'photo:upload', description: 'Enviar fotos' }];

function role(name: string, permissions: string[]): AdminRole {
  return { id: name, code: name, name, system: false, permissions, userCount: 1 };
}

function describeOne(
  roles: AdminRole[],
  overrides: PermissionOverride[],
): PermissionRow | undefined {
  const [row] = describePermissionRows({ catalog: CATALOG, roles, overrides });
  return row;
}

describe('describePermissionRows', () => {
  it.each([
    {
      scenario: 'comes from the group',
      roles: [role('Gerente', ['photo:upload'])],
      overrides: [],
      isEffective: true,
    },
    {
      scenario: 'is missing when no group has it',
      roles: [role('Gerente', [])],
      overrides: [],
      isEffective: false,
    },
    {
      scenario: 'is added by an individual grant',
      roles: [role('Gerente', [])],
      overrides: [{ permission: 'photo:upload', effect: 'GRANTED' as const }],
      isEffective: true,
    },
    {
      scenario: 'is taken away by an individual revoke even if a group has it',
      roles: [role('Gerente', ['photo:upload'])],
      overrides: [{ permission: 'photo:upload', effect: 'REVOKED' as const }],
      isEffective: false,
    },
  ])('a permission that $scenario', ({ roles, overrides, isEffective }) => {
    expect(describeOne(roles, overrides)?.isEffective).toBe(isEffective);
  });

  it('names every group that gives the permission', () => {
    const row = describeOne(
      [role('Gerente', ['photo:upload']), role('Voluntários', ['photo:upload']), role('Outro', [])],
      [],
    );

    expect(row?.roleNames).toEqual(['Gerente', 'Voluntários']);
  });
});
