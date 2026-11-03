import type { ReactElement } from 'react';
import { Marquee } from '@/components/motion/Marquee';

interface MarqueeBandProps {
  items: string[];
  reverse?: boolean;
  tilt?: 'left' | 'right';
}

const TILT_CLASS_NAMES = { left: '-rotate-2', right: 'rotate-2' };

export function MarqueeBand({
  items,
  reverse = false,
  tilt = 'left',
}: MarqueeBandProps): ReactElement {
  return (
    <div className="relative z-20 -my-6 overflow-x-clip py-6 md:-my-10 md:py-10">
      <div
        className={`-mx-4 bg-sun py-3 text-brand-900 shadow-[0_10px_30px_rgba(7,59,134,0.25)] ${TILT_CLASS_NAMES[tilt]}`}
      >
        <Marquee items={items} reverse={reverse} className="font-display text-4xl md:text-6xl" />
      </div>
    </div>
  );
}
