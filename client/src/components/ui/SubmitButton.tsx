'use client';

import type { ReactElement, ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

type SubmitButtonVariant = 'primary' | 'secondary' | 'danger';

const BASE_CLASS =
  'inline-flex items-center justify-center rounded-xl font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60';

const VARIANT_CLASSES: Record<SubmitButtonVariant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700',
  secondary: 'border border-admin-line bg-admin-surface hover:border-brand-500',
  danger: 'bg-danger text-white hover:opacity-90',
};

interface SubmitButtonProps {
  children: ReactNode;
  pendingLabel: string;
  variant?: SubmitButtonVariant;
  className?: string;
}

export function SubmitButton({
  children,
  pendingLabel,
  variant = 'primary',
  className = 'min-h-12 px-6',
}: SubmitButtonProps): ReactElement {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={`${BASE_CLASS} ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
