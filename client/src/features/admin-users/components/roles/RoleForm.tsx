'use client';

import type { ReactElement } from 'react';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { TextField } from '@/components/ui/TextField';
import { useRoleForm } from '../../hooks/use-role-form';
import type { PermissionDescription, RoleFormState, RoleFormValues } from '../../types';
import { FormFeedback } from '../FormFeedback';
import { PermissionChecklist } from './PermissionChecklist';

const MAX_NAME_LENGTH = 120;

interface RoleFormProps {
  action: (previous: RoleFormState, formData: FormData) => Promise<RoleFormState>;
  initialValues: RoleFormValues;
  catalog: PermissionDescription[];
  canChangePermissions: boolean;
  submitLabel: string;
}

export function RoleForm({
  action,
  initialValues,
  catalog,
  canChangePermissions,
  submitLabel,
}: RoleFormProps): ReactElement {
  const form = useRoleForm(action, initialValues);
  return (
    <form action={form.formAction} className="flex flex-col gap-5">
      <TextField
        name="name"
        label="Nome do grupo"
        defaultValue={form.state.values.name}
        errorMessage={form.errorFor('name')}
        maxLength={MAX_NAME_LENGTH}
        onInput={form.touch('name')}
      />
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-bold">Permissões do grupo</h2>
        <PermissionChecklist
          catalog={catalog}
          selected={form.state.values.permissions}
          isDisabled={!canChangePermissions}
          onChange={form.touch('permissions')}
        />
      </div>
      <FormFeedback errorMessage={form.otherError} isSaved={form.state.isSaved} />
      <div>
        <SubmitButton pendingLabel="Salvando…">{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}
