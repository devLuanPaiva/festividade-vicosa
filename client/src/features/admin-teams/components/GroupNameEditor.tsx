'use client';

import { useActionState, useState, type KeyboardEvent, type ReactElement } from 'react';
import { useFormStatus } from 'react-dom';
import { renameGroupAction } from '../actions/group-actions';
import { INITIAL_GROUP_STATE } from '../types';

interface GroupNameEditorProps {
  groupId: string;
  name: string;
}

interface NameInputProps {
  name: string;
  onCancel: () => void;
}

function NameInput({ name, onCancel }: NameInputProps): ReactElement {
  const { pending } = useFormStatus();
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Escape') {
      onCancel();
    }
  };
  return (
    <input
      name="name"
      defaultValue={name}
      aria-label="Nome do grupo"
      maxLength={120}
      autoComplete="off"
      autoFocus
      required
      disabled={pending}
      onKeyDown={handleKeyDown}
      onBlur={() => {
        if (!pending) {
          onCancel();
        }
      }}
      className="h-full w-full rounded-lg border border-brand-500 bg-white px-3 font-semibold outline-none ring-2 ring-brand-500/30 disabled:opacity-60"
    />
  );
}

export function GroupNameEditor({ groupId, name }: GroupNameEditorProps): ReactElement {
  const [isEditing, setIsEditing] = useState(false);
  const [state, formAction] = useActionState(renameGroupAction.bind(null, groupId), {
    ...INITIAL_GROUP_STATE,
    name,
  });

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <div className="grid h-11">
        {isEditing ? (
          <form action={formAction} className="col-start-1 row-start-1 h-full">
            <NameInput name={name} onCancel={() => setIsEditing(false)} />
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            aria-label={`Renomear o grupo ${name}`}
            className="col-start-1 row-start-1 flex h-full w-full items-center gap-2 rounded-lg px-3 text-left font-semibold hover:bg-admin-canvas"
          >
            <span className="truncate">{name}</span>
            <span aria-hidden="true" className="text-admin-muted">
              ✎
            </span>
          </button>
        )}
      </div>
      {isEditing && state.errorMessage ? (
        <p role="alert" className="px-3 text-sm text-danger">
          {state.errorMessage}
        </p>
      ) : null}
    </div>
  );
}
