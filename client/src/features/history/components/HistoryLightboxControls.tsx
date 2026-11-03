import type { MouseEvent, ReactElement } from 'react';

const ROUND_BUTTON_CLASS =
  'absolute inline-flex size-12 items-center justify-center rounded-full bg-white/10 text-3xl text-white transition-colors hover:bg-white/25 focus-visible:outline-4 focus-visible:outline-sun';
const SIDE_BUTTON_CLASS = `${ROUND_BUTTON_CLASS} top-1/2 -translate-y-1/2`;

interface HistoryLightboxControlsProps {
  position: number;
  total: number;
  onStep: (offset: number) => void;
  onClose: () => void;
}

export function HistoryLightboxControls({
  position,
  total,
  onStep,
  onClose,
}: HistoryLightboxControlsProps): ReactElement {
  const stepOnClick =
    (offset: number) =>
    (event: MouseEvent): void => {
      event.stopPropagation();
      onStep(offset);
    };

  return (
    <>
      <p className="absolute left-4 top-5 text-sm font-semibold text-white/80">
        {position} / {total}
      </p>
      <button
        type="button"
        aria-label="Fechar"
        autoFocus
        onClick={onClose}
        className={`${ROUND_BUTTON_CLASS} right-3 top-3`}
      >
        ×
      </button>
      <button
        type="button"
        aria-label="Foto anterior"
        onClick={stepOnClick(-1)}
        className={`${SIDE_BUTTON_CLASS} left-3`}
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Próxima foto"
        onClick={stepOnClick(1)}
        className={`${SIDE_BUTTON_CLASS} right-3`}
      >
        ›
      </button>
    </>
  );
}
