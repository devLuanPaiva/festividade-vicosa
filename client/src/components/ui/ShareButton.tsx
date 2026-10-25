'use client';

import type { ReactElement } from 'react';
import { Icon } from '@/components/ui/Icon';
import { buildWhatsAppHref, resolveShareUrl } from '@/lib/share/share-links';

const ABORT_ERROR_NAME = 'AbortError';

const BUTTON_CLASS =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-brand-500 px-7 font-semibold text-brand-700 transition-colors hover:bg-brand-500 hover:text-white';
const ICON_CLASS =
  'absolute inline-flex size-12 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70';

interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
  label?: string;
  iconClassName?: string;
}

async function shareLink(title: string, text: string, url: string): Promise<void> {
  const link = resolveShareUrl(url, window.location.href);
  if (typeof navigator.share !== 'function') {
    window.open(buildWhatsAppHref(text, link), '_blank', 'noopener,noreferrer');
    return;
  }
  try {
    await navigator.share({ title, text, url: link });
  } catch (error) {
    if (!(error instanceof DOMException && error.name === ABORT_ERROR_NAME)) {
      window.open(buildWhatsAppHref(text, link), '_blank', 'noopener,noreferrer');
    }
  }
}

export function ShareButton({
  title,
  text,
  url,
  label,
  iconClassName,
}: ShareButtonProps): ReactElement {
  const isIconOnly = label === undefined;
  return (
    <button
      type="button"
      aria-label={isIconOnly ? 'Compartilhar esta foto' : undefined}
      onClick={() => void shareLink(title, text, url)}
      className={isIconOnly ? `${ICON_CLASS} ${iconClassName ?? ''}` : BUTTON_CLASS}
    >
      <Icon name="share" className={isIconOnly ? 'size-6' : 'size-5'} />
      {label}
    </button>
  );
}
