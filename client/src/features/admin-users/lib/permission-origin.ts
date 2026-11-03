import type {
  AdminRole,
  OverrideEffect,
  PermissionDescription,
  PermissionOverride,
} from '../types';

export type OverrideChoice = 'INHERIT' | OverrideEffect;

export interface PermissionRow {
  code: string;
  description: string;
  roleNames: string[];
  choice: OverrideChoice;
  isEffective: boolean;
}

interface DescribeInput {
  catalog: PermissionDescription[];
  roles: AdminRole[];
  overrides: PermissionOverride[];
}

export function isPermissionEffective(choice: OverrideChoice, roleNames: string[]): boolean {
  if (choice === 'INHERIT') {
    return roleNames.length > 0;
  }
  return choice === 'GRANTED';
}

export function describePermissionRows({
  catalog,
  roles,
  overrides,
}: DescribeInput): PermissionRow[] {
  return catalog.map(({ code, description }) => {
    const roleNames = roles
      .filter((role) => role.permissions.includes(code))
      .map((role) => role.name);
    const choice = overrides.find((override) => override.permission === code)?.effect ?? 'INHERIT';
    return {
      code,
      description,
      roleNames,
      choice,
      isEffective: isPermissionEffective(choice, roleNames),
    };
  });
}
