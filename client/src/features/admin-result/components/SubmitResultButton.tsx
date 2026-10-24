import type { ReactElement } from 'react';

interface SubmitResultButtonProps {
  isPending: boolean;
  isCorrection: boolean;
}

function labelFor({ isPending, isCorrection }: SubmitResultButtonProps): string {
  if (isPending) {
    return 'Salvando…';
  }
  return isCorrection ? 'Salvar correção' : 'Finalizar partida';
}

export function SubmitResultButton(props: SubmitResultButtonProps): ReactElement {
  return (
    <button
      type="submit"
      disabled={props.isPending}
      className="min-h-14 rounded-2xl bg-brand-600 px-6 text-base font-bold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
    >
      {labelFor(props)}
    </button>
  );
}
