import type { ReactElement } from 'react';

const ROUND_BUTTON_CLASS =
  'absolute inline-flex size-12 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70';
const SIDE_BUTTON_CLASS = `${ROUND_BUTTON_CLASS} top-1/2 -translate-y-1/2 text-3xl`;

interface LightboxControlsProps {
  onStep: (offset: number) => void;
  onClose: () => void;
}

export function LightboxControls({ onStep, onClose }: LightboxControlsProps): ReactElement {
  return (
    <>
      <button
        type="button"
        aria-label="Foto anterior"
        onClick={() => onStep(-1)}
        className={`${SIDE_BUTTON_CLASS} left-3`}
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Próxima foto"
        onClick={() => onStep(1)}
        className={`${SIDE_BUTTON_CLASS} right-3`}
      >
        ›
      </button>
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className={`${ROUND_BUTTON_CLASS} right-3 top-3 text-2xl`}
      >
        ×
      </button>
    </>
  );
}
