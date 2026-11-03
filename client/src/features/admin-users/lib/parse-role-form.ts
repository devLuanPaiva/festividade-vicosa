import { readText } from '@/lib/forms/form-data';
import type { RoleFormValues } from '../types';

export const PERMISSIONS_FIELD = 'permissions';

export function parseRoleForm(formData: FormData): RoleFormValues {
  return {
    name: readText(formData, 'name'),
    permissions: formData
      .getAll(PERMISSIONS_FIELD)
      .filter((code): code is string => typeof code === 'string'),
  };
}
