'use client';

import type { ReactElement } from 'react';
import { FormFooter } from '@/components/ui/FormFooter';
import { SelectField } from '@/components/ui/SelectField';
import { createUserAction } from '../../actions/user-actions';
import { useUserForm } from '../../hooks/use-user-form';
import { ADMIN_USERS_PATH } from '@/features/admin-shell/lib/admin-sections';
import { EMPTY_USER_VALUES, type AdminRole } from '../../types';
import { FormFeedback } from '../FormFeedback';
import { UserFields } from './UserFields';

interface NewUserFormProps {
  roles: AdminRole[];
}

export function NewUserForm({ roles }: NewUserFormProps): ReactElement {
  const form = useUserForm(createUserAction, {
    ...EMPTY_USER_VALUES,
    roleId: roles[0]?.id ?? '',
  });
  return (
    <form action={form.formAction} className="flex flex-col gap-5">
      <UserFields form={form} isPasswordOptional={false} />
      <SelectField
        name="roleId"
        label="Grupo principal"
        defaultValue={form.state.values.roleId}
        options={roles.map((role) => ({ value: role.id, label: role.name }))}
        errorMessage={form.errorFor('roleId')}
        onInput={form.touch('roleId')}
      />
      <p className="text-sm text-admin-muted">
        Depois de criar, você pode incluir o usuário em outros grupos e ajustar permissões.
      </p>
      <FormFeedback errorMessage={form.otherError} isSaved={false} />
      <FormFooter cancelHref={ADMIN_USERS_PATH} submitLabel="Criar usuário" />
    </form>
  );
}
