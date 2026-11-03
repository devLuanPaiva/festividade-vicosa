import Link from 'next/link';
import type { ReactElement } from 'react';
import type { Modality } from '../../data/home-content';

interface ModalityCardProps {
  modality: Modality;
  href: string;
}

export function ModalityCard({ modality, href }: ModalityCardProps): ReactElement {
  return (
    <Link
      href={href}
      className="group relative block h-full overflow-hidden rounded-3xl border-t-4 border-sun bg-brand-900/90 p-6 shadow-[0_18px_40px_rgba(3,20,70,0.45)] transition-colors duration-300 hover:bg-brand-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sun"
    >
      <p className="font-display text-3xl text-sun">{modality.dates}</p>
      <h3 className="mt-3 font-display text-5xl leading-none text-white">{modality.name}</h3>
      <p className="mt-4 text-sm text-white/75">{modality.detail}</p>
    </Link>
  );
}
