import Link from 'next/link';
import type { ReactElement } from 'react';
import { SubmitButton } from '@/components/ui/SubmitButton';

interface FormFooterProps {
  cancelHref: string;
  submitLabel: string;
}

export function FormFooter({ cancelHref, submitLabel }: FormFooterProps): ReactElement {
  return (
    <div className="sticky bottom-0 flex gap-3 border-t border-admin-line bg-admin-canvas py-3">
      <Link
        href={cancelHref}
        className="inline-flex min-h-12 items-center rounded-xl border border-admin-line bg-admin-surface px-6 font-semibold hover:border-brand-500"
      >
        Cancelar
      </Link>
      <SubmitButton pendingLabel="Salvando…" className="min-h-12 flex-1 px-6">
        {submitLabel}
      </SubmitButton>
    </div>
  );
}
