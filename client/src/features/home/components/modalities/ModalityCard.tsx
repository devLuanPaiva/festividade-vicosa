import type { ReactElement } from 'react';
import { Sparkle } from '@/components/ui/Sparkle';
import type { Modality } from '../../data/home-content';

interface ModalityCardProps {
  modality: Modality;
}

export function ModalityCard({ modality }: ModalityCardProps): ReactElement {
  return (
    <article className="group relative h-full overflow-hidden rounded-3xl border-t-4 border-sun bg-brand-900/90 p-6 shadow-[0_18px_40px_rgba(3,20,70,0.45)] transition-colors duration-300 hover:bg-brand-900">
      <Sparkle className="absolute -right-3 -top-3 size-16 text-sun/20 transition-transform duration-500 group-hover:rotate-90 group-hover:scale-125" />
      <p className="font-display text-3xl text-sun">{modality.dates}</p>
      <h3 className="mt-3 font-display text-5xl leading-none text-white">{modality.name}</h3>
      <p className="mt-4 text-sm text-white/75">{modality.detail}</p>
    </article>
  );
}
