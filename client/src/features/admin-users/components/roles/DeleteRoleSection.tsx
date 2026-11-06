import type { ReactElement } from 'react';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { deleteRoleAction } from '../../actions/role-actions';
import type { AdminRole } from '../../types';

interface DeleteRoleSectionProps {
  role: AdminRole;
}

function blockedReason(role: AdminRole): string | null {
  if (role.system) {
    return 'Este é um grupo padrão do sistema e não pode ser excluído.';
  }
  if (role.userCount > 0) {
    return 'Este grupo ainda tem usuários. Tire todos eles do grupo antes de excluir.';
  }
  return null;
}

export function DeleteRoleSection({ role }: Readonly<DeleteRoleSectionProps>): ReactElement {
  const reason = blockedReason(role);
  return (
    <section
      aria-labelledby="delete-role-title"
      className="flex items-center justify-between gap-3 border-t border-admin-line pt-5"
    >
      <div className="flex flex-col gap-1">
        <h2 id="delete-role-title" className="font-bold">
          Excluir grupo
        </h2>
        <p className="text-sm text-admin-muted">
          {reason ?? 'Só é possível excluir um grupo sem usuários.'}
        </p>
      </div>
      {reason ? null : (
        <ConfirmDeleteDialog
          triggerLabel="Excluir grupo"
          title="Excluir este grupo?"
          description="As permissões do pacote deixam de existir. Esta ação não pode ser desfeita."
          confirmLabel="Excluir grupo"
          action={deleteRoleAction.bind(null, role.id)}
        />
      )}
    </section>
  );
}
