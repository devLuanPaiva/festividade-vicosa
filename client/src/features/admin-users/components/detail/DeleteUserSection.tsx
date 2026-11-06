import type { ReactElement } from 'react';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { deleteUserAction } from '../../actions/user-actions';

interface DeleteUserSectionProps {
  userId: string;
}

export function DeleteUserSection({ userId }: Readonly<DeleteUserSectionProps>): ReactElement {
  return (
    <section
      aria-labelledby="delete-user-title"
      className="flex items-center justify-between gap-3 border-t border-admin-line pt-5"
    >
      <div className="flex flex-col gap-1">
        <h2 id="delete-user-title" className="font-bold">
          Excluir usuário
        </h2>
        <p className="text-sm text-admin-muted">
          Só é possível excluir quem nunca lançou resultado nem enviou foto. Nos demais casos,
          desative o usuário.
        </p>
      </div>
      <ConfirmDeleteDialog
        triggerLabel="Excluir usuário"
        title="Excluir este usuário?"
        description="Ele perde o acesso e os dados são apagados. Esta ação não pode ser desfeita."
        confirmLabel="Excluir usuário"
        action={deleteUserAction.bind(null, userId)}
      />
    </section>
  );
}
