'use client';

import { useActionState, useState, type ReactElement } from 'react';
import { SubmitButton } from '@/components/ui/SubmitButton';
import type { GroupStandings } from '@/features/games/types';
import { generalError } from '@/lib/forms/form-errors';
import { useDismissibleErrors } from '@/lib/forms/use-dismissible-errors';
import { useWarnOnDirty } from '@/lib/forms/use-warn-on-dirty';
import { confirmQualifiedAction } from '../actions/qualified-actions';
import { initialQualifiedState, QUALIFIED_ERROR_FIELD, type QualifiedFormState } from '../types';
import { QualifiedTeamRow } from './QualifiedTeamRow';

interface QualifiedGroupFormProps {
  group: GroupStandings;
}

function confirmedPositions(group: GroupStandings): Record<string, string> {
  return Object.fromEntries(
    group.rows.map((row) => [row.teamId, row.qualifiedPosition?.toString() ?? '']),
  );
}

export function QualifiedGroupForm({ group }: QualifiedGroupFormProps): ReactElement {
  const [state, formAction] = useActionState(
    confirmQualifiedAction.bind(null, group.groupId),
    initialQualifiedState(confirmedPositions(group)),
  );
  const { errorFor, dismiss } = useDismissibleErrors(state);
  const [changedAfter, setChangedAfter] = useState<QualifiedFormState | null>(null);
  const hasUnsavedChanges = changedAfter === state;
  useWarnOnDirty(hasUnsavedChanges);

  const touch = (): void => {
    dismiss(QUALIFIED_ERROR_FIELD);
    setChangedAfter(state);
  };
  const error = errorFor(QUALIFIED_ERROR_FIELD) ?? generalError(state, [QUALIFIED_ERROR_FIELD]);

  return (
    <form
      action={formAction}
      aria-labelledby={`qualified-${group.groupId}`}
      className="overflow-hidden rounded-2xl border border-admin-line bg-admin-surface"
    >
      <h2
        id={`qualified-${group.groupId}`}
        className="border-b border-admin-line bg-admin-canvas px-4 py-2 text-xs font-bold uppercase tracking-wide text-admin-muted"
      >
        {group.groupName} · posição entre os classificados
      </h2>
      <ul className="divide-y divide-admin-line">
        {group.rows.map((row) => (
          <QualifiedTeamRow
            key={row.teamId}
            row={row}
            defaultPosition={state.positions[row.teamId] ?? ''}
            onInput={touch}
          />
        ))}
      </ul>
      <div className="flex flex-col gap-3 border-t border-admin-line p-4">
        {error ? (
          <p role="alert" className="text-sm font-semibold text-danger">
            {error}
          </p>
        ) : null}
        {state.isSaved && !hasUnsavedChanges ? (
          <p role="status" className="text-sm font-semibold text-success">
            Classificados salvos.
          </p>
        ) : null}
        <SubmitButton pendingLabel="Salvando…" className="min-h-12 px-6">
          Salvar classificados
        </SubmitButton>
      </div>
    </form>
  );
}
