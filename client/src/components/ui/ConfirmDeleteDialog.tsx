'use client';

import {
  useActionState,
  useId,
  useRef,
  type ReactElement,
  type RefObject,
  type SyntheticEvent,
} from 'react';
import { INITIAL_FORM_ERROR_STATE, type FormErrorState } from '@/lib/forms/form-errors';
import { SubmitButton } from './SubmitButton';

interface ConfirmDeleteDialogProps {
  triggerLabel: string;
  title: string;
  description: string;
  confirmLabel: string;
  action: (previous: FormErrorState) => Promise<FormErrorState>;
}

interface DialogActionsProps {
  confirmLabel: string;
  isPending: boolean;
  cancelRef: RefObject<HTMLButtonElement | null>;
  onCancel: () => void;
}

const SECONDARY_BUTTON_CLASS =
  'inline-flex min-h-12 items-center justify-center rounded-xl border border-admin-line bg-admin-surface px-6 font-semibold transition-colors hover:border-brand-500 disabled:cursor-not-allowed disabled:opacity-60';

function DialogActions({
  confirmLabel,
  isPending,
  cancelRef,
  onCancel,
}: DialogActionsProps): ReactElement {
  return (
    <div className="flex flex-wrap justify-end gap-3">
      <button
        ref={cancelRef}
        type="button"
        onClick={onCancel}
        disabled={isPending}
        className={SECONDARY_BUTTON_CLASS}
      >
        Cancelar
      </button>
      <SubmitButton variant="danger" pendingLabel="Excluindo…">
        {confirmLabel}
      </SubmitButton>
    </div>
  );
}

interface DialogControls {
  dialogRef: RefObject<HTMLDialogElement | null>;
  cancelRef: RefObject<HTMLButtonElement | null>;
  open: () => void;
  close: () => void;
  keepOpenWhilePending: (event: SyntheticEvent) => void;
}

function useDialogControls(isPending: boolean): DialogControls {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const open = (): void => {
    dialogRef.current?.showModal();
    cancelRef.current?.focus();
  };
  const close = (): void => {
    dialogRef.current?.close();
  };
  const keepOpenWhilePending = (event: SyntheticEvent): void => {
    if (isPending) {
      event.preventDefault();
    }
  };

  return { dialogRef, cancelRef, open, close, keepOpenWhilePending };
}

export function ConfirmDeleteDialog({
  triggerLabel,
  title,
  description,
  confirmLabel,
  action,
}: ConfirmDeleteDialogProps): ReactElement {
  const titleId = useId();
  const [state, formAction, isPending] = useActionState(action, INITIAL_FORM_ERROR_STATE);
  const { dialogRef, cancelRef, open, close, keepOpenWhilePending } = useDialogControls(isPending);

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold text-danger hover:bg-danger/10"
      >
        {triggerLabel}
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onCancel={keepOpenWhilePending}
        className="m-auto w-[90%] max-w-md rounded-2xl bg-admin-surface p-6 text-admin-ink shadow-xl backdrop:bg-black/40"
      >
        <form action={formAction} className="flex flex-col gap-4">
          <h2 id={titleId} className="text-lg font-bold">
            {title}
          </h2>
          <p className="text-sm text-admin-muted">{description}</p>
          {state.errorMessage ? (
            <p
              role="alert"
              className="rounded-xl bg-danger/10 p-3 text-sm font-semibold text-danger"
            >
              {state.errorMessage}
            </p>
          ) : null}
          <DialogActions
            confirmLabel={confirmLabel}
            isPending={isPending}
            cancelRef={cancelRef}
            onCancel={close}
          />
        </form>
      </dialog>
    </>
  );
}
