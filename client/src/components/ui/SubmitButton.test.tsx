import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SubmitButton } from './SubmitButton';

interface Deferred {
  promise: Promise<void>;
  resolve: () => void;
}

function createDeferred(): Deferred {
  let resolve: () => void = () => undefined;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

describe('SubmitButton', () => {
  it('stays disabled while the action runs, so a second click cannot repeat it', async () => {
    const response = createDeferred();
    let submissions = 0;
    const action = async (): Promise<void> => {
      submissions += 1;
      await response.promise;
    };
    render(
      <form action={action}>
        <SubmitButton pendingLabel="Salvando…">Salvar</SubmitButton>
      </form>,
    );
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Salvar' }));
    const busyButton = await screen.findByRole('button', { name: 'Salvando…' });
    await user.click(busyButton);
    await user.click(busyButton);

    expect(busyButton).toBeDisabled();
    expect(busyButton).toHaveAttribute('aria-busy', 'true');
    expect(submissions).toBe(1);

    response.resolve();
    await waitFor(() => expect(screen.getByRole('button', { name: 'Salvar' })).toBeEnabled());
  });

  it('is ready to use before anything is submitted', () => {
    render(
      <form action={() => undefined}>
        <SubmitButton pendingLabel="Salvando…">Salvar</SubmitButton>
      </form>,
    );

    expect(screen.getByRole('button', { name: 'Salvar' })).toBeEnabled();
  });
});
