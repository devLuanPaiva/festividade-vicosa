'use client';

import type { ReactElement } from 'react';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { updateUserAction } from '../../actions/user-actions';
import { useUserForm } from '../../hooks/use-user-form';
import type { AdminUser } from '../../types';
import { FormFeedback } from '../FormFeedback';
import { UserFields } from './UserFields';

interface UserProfileFormProps {
  user: AdminUser;
}

export function UserProfileForm({ user }: Readonly<UserProfileFormProps>): ReactElement {
  const form = useUserForm(updateUserAction.bind(null, user.id), {
    name: user.name,
    email: user.email,
    password: '',
    roleId: '',
  });
  return (
    <form action={form.formAction} className="flex flex-col gap-5">
      <UserFields form={form} isPasswordOptional />
      <FormFeedback errorMessage={form.otherError} isSaved={form.state.isSaved} />
      <div>
        <SubmitButton pendingLabel="Salvando…">Salvar dados</SubmitButton>
      </div>
    </form>
  );
}
