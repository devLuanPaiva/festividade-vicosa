import Link from 'next/link';
import type { ReactElement, ReactNode } from 'react';

type ButtonVariant = 'sun' | 'outline' | 'brand';

const BASE_CLASS_NAME =
  'group inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 font-semibold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0';

const VARIANT_CLASS_NAMES: Record<ButtonVariant, string> = {
  sun: 'bg-sun text-brand-900 shadow-[0_6px_0_#c9a900] hover:shadow-[0_8px_0_#c9a900] active:shadow-[0_2px_0_#c9a900]',
  outline: 'text-white ring-2 ring-white/70 hover:bg-white hover:text-brand-900',
  brand:
    'bg-brand-500 text-white shadow-[0_6px_0_#192aa5] hover:shadow-[0_8px_0_#192aa5] active:shadow-[0_2px_0_#192aa5]',
};

interface ButtonLinkProps {
  href: string;
  variant?: ButtonVariant;
  children: ReactNode;
}

export function ButtonLink({ href, variant = 'sun', children }: ButtonLinkProps): ReactElement {
  return (
    <Link href={href} className={`${BASE_CLASS_NAME} ${VARIANT_CLASS_NAMES[variant]}`}>
      {children}
      <span
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}
