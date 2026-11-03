import type { ReactElement } from 'react';
import { Icon } from '@/components/ui/Icon';
import { ShareButton } from '@/components/ui/ShareButton';

const ROUND_BUTTON_CLASS =
  'absolute inline-flex size-12 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70';
const SIDE_BUTTON_CLASS = `${ROUND_BUTTON_CLASS} top-1/2 -translate-y-1/2 text-3xl`;

interface LightboxControlsProps {
  downloadUrl: string;
  share: { title: string; text: string; url: string };
  onStep: (offset: number) => void;
  onClose: () => void;
}

export function LightboxControls({
  downloadUrl,
  share,
  onStep,
  onClose,
}: LightboxControlsProps): ReactElement {
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
      <ShareButton {...share} iconClassName="right-28 top-3" />
      <a
        href={downloadUrl}
        download
        aria-label="Baixar esta foto"
        className={`${ROUND_BUTTON_CLASS} right-16 top-3 text-xl`}
      >
        <Icon name="download" className="size-6" />
      </a>
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
