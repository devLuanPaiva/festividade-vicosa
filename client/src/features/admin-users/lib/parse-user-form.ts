import { readText } from '@/lib/forms/form-data';
import type { UserFormValues } from '../types';

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  roleId: string;
}

export interface UpdateUserPayload {
  name: string;
  email: string;
  password?: string;
}

export function parseUserForm(formData: FormData): UserFormValues {
  return {
    name: readText(formData, 'name'),
    email: readText(formData, 'email'),
    password: formData.get('password')?.toString() ?? '',
    roleId: readText(formData, 'roleId'),
  };
}

export function toCreateUserPayload(values: UserFormValues): CreateUserPayload {
  return {
    name: values.name,
    email: values.email,
    password: values.password,
    roleId: values.roleId,
  };
}

export function toUpdateUserPayload(values: UserFormValues): UpdateUserPayload {
  return {
    name: values.name,
    email: values.email,
    ...(values.password && { password: values.password }),
  };
}
