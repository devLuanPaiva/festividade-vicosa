import Link from 'next/link';
import type { ReactElement } from 'react';

interface FilterChipProps {
  href: string;
  isActive: boolean;
  label: string;
}

export function FilterChip({ href, isActive, label }: FilterChipProps): ReactElement {
  const tone = isActive
    ? 'bg-sun text-brand-900 shadow-[0_4px_0_#c9a900]'
    : 'bg-white/15 text-white ring-1 ring-white/40 hover:bg-white/25';
  return (
    <Link
      href={href}
      aria-current={isActive ? 'true' : undefined}
      scroll={false}
      className={`inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold transition-all duration-200 ${tone}`}
    >
      {label}
    </Link>
  );
}
