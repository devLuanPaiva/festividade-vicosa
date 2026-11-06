'use client';

import { useActionState, type ReactElement } from 'react';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { INITIAL_FORM_ERROR_STATE } from '@/lib/forms/form-errors';
import { setUserActiveAction } from '../../actions/user-actions';
import type { AdminUser } from '../../types';
import { FormFeedback } from '../FormFeedback';

interface UserStatusSectionProps {
  user: AdminUser;
  isSelf: boolean;
}

export function UserStatusSection({
  user,
  isSelf,
}: Readonly<UserStatusSectionProps>): ReactElement {
  const [state, formAction] = useActionState(
    setUserActiveAction.bind(null, user.id, !user.active),
    INITIAL_FORM_ERROR_STATE,
  );
  const canDeactivate = !(isSelf && user.active);
  return (
    <section
      aria-labelledby="status-title"
      className="flex flex-col gap-3 border-t border-admin-line pt-5"
    >
      <h2 id="status-title" className="font-bold">
        {user.active ? 'Desativar usuário' : 'Reativar usuário'}
      </h2>
      <p className="text-sm text-admin-muted">
        {user.active
          ? 'Um usuário desativado perde o acesso na hora, mas o histórico do que ele lançou é mantido.'
          : 'Este usuário está sem acesso ao painel. Reative para ele voltar a entrar.'}
      </p>
      <FormFeedback errorMessage={state.errorMessage} isSaved={false} />
      <form action={formAction}>
        <SubmitButton
          variant={user.active ? 'danger' : 'primary'}
          pendingLabel="Salvando…"
          disabled={!canDeactivate}
        >
          {user.active ? 'Desativar usuário' : 'Reativar usuário'}
        </SubmitButton>
      </form>
    </section>
  );
}
