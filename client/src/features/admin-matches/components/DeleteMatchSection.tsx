import type { ReactElement } from 'react';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { deleteMatchAction } from '../actions/match-actions';
import type { MatchTarget } from '../types';

interface DeleteMatchSectionProps {
  target: MatchTarget;
}

export function DeleteMatchSection({ target }: DeleteMatchSectionProps): ReactElement {
  return (
    <section
      aria-labelledby="delete-match-title"
      className="flex items-center justify-between gap-3 border-t border-admin-line pt-5"
    >
      <div className="flex flex-col gap-1">
        <h2 id="delete-match-title" className="font-bold">
          Excluir partida
        </h2>
        <p className="text-sm text-admin-muted">
          O resultado lançado e a classificação são recalculados sem esta partida.
        </p>
      </div>
      <ConfirmDeleteDialog
        triggerLabel="Excluir partida"
        title="Excluir esta partida?"
        description="Esta ação não pode ser desfeita."
        confirmLabel="Excluir partida"
        action={deleteMatchAction.bind(null, target)}
      />
    </section>
  );
}
