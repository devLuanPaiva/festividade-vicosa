import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import type { FormErrorState } from '@/lib/forms/form-errors';
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog';

const NO_ERROR: FormErrorState = { errorMessage: null, errorField: null };

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal(): void {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function close(): void {
    this.removeAttribute('open');
  };
});

function renderDialog(action: () => Promise<FormErrorState>): void {
  render(
    <ConfirmDeleteDialog
      triggerLabel="Excluir time"
      title="Excluir o time 'Gaviões'?"
      description="Esta ação não pode ser desfeita."
      confirmLabel="Excluir time"
      action={action}
    />,
  );
}

describe('ConfirmDeleteDialog', () => {
  it('names the item and starts with the safe choice focused', async () => {
    renderDialog(() => Promise.resolve(NO_ERROR));

    await userEvent.click(screen.getByRole('button', { name: 'Excluir time' }));

    expect(screen.getByRole('heading', { name: "Excluir o time 'Gaviões'?" })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toHaveFocus();
  });

  it('does nothing when the person cancels', async () => {
    const action = vi.fn().mockResolvedValue(NO_ERROR);
    renderDialog(action);
    await userEvent.click(screen.getByRole('button', { name: 'Excluir time' }));

    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(action).not.toHaveBeenCalled();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('deletes once, even if the confirm button is clicked again while the api answers', async () => {
    let finish: () => void = () => undefined;
    const action = vi.fn(
      () =>
        new Promise<FormErrorState>((resolve) => {
          finish = () => resolve(NO_ERROR);
        }),
    );
    renderDialog(action);
    await userEvent.click(screen.getByRole('button', { name: 'Excluir time' }));
    const dialog = screen.getByRole('dialog');

    const confirm = dialog.querySelector('button[type="submit"]') as HTMLButtonElement;
    await userEvent.click(confirm);
    await userEvent.click(confirm);
    await userEvent.click(confirm);

    expect(action).toHaveBeenCalledTimes(1);
    expect(confirm).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled();
    finish();
    await waitFor(() => expect(confirm).toBeEnabled());
  });

  it('keeps the dialog open and shows why the item could not be deleted', async () => {
    const action = vi.fn().mockResolvedValue({
      errorMessage: 'Este time tem partidas. Exclua as partidas antes.',
      errorField: null,
    });
    renderDialog(action);
    await userEvent.click(screen.getByRole('button', { name: 'Excluir time' }));

    const dialog = screen.getByRole('dialog');
    await userEvent.click(dialog.querySelector('button[type="submit"]') as HTMLButtonElement);

    expect(await screen.findByRole('alert')).toHaveTextContent('Este time tem partidas');
    expect(dialog).toHaveAttribute('open');
  });
});
