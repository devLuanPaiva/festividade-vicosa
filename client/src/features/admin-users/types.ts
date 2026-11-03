import type { FormErrorState } from '@/lib/forms/form-errors';

export interface UserRoleSummary {
  id: string;
  name: string;
  primary: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  active: boolean;
  roles: UserRoleSummary[];
  createdAt: string;
}

export interface AdminRole {
  id: string;
  code: string;
  name: string;
  system: boolean;
  permissions: string[];
  userCount: number;
}

export interface PermissionDescription {
  code: string;
  description: string;
}

export type OverrideEffect = 'GRANTED' | 'REVOKED';

export interface PermissionOverride {
  permission: string;
  effect: OverrideEffect;
}

export interface UserPermissions {
  permissions: string[];
  overrides: PermissionOverride[];
}

export interface UserFormValues {
  name: string;
  email: string;
  password: string;
  roleId: string;
}

export interface UserFormState extends FormErrorState {
  values: UserFormValues;
  isSaved: boolean;
}

export const EMPTY_USER_VALUES: UserFormValues = { name: '', email: '', password: '', roleId: '' };

export const INITIAL_USER_STATE: UserFormState = {
  errorMessage: null,
  errorField: null,
  values: EMPTY_USER_VALUES,
  isSaved: false,
};

export interface RoleFormValues {
  name: string;
  permissions: string[];
}

export interface RoleFormState extends FormErrorState {
  values: RoleFormValues;
  isSaved: boolean;
}

export const EMPTY_ROLE_VALUES: RoleFormValues = { name: '', permissions: [] };

export const INITIAL_ROLE_STATE: RoleFormState = {
  errorMessage: null,
  errorField: null,
  values: EMPTY_ROLE_VALUES,
  isSaved: false,
};

export interface AccessFormState extends FormErrorState {
  isSaved: boolean;
}

export const INITIAL_ACCESS_STATE: AccessFormState = {
  errorMessage: null,
  errorField: null,
  isSaved: false,
};
