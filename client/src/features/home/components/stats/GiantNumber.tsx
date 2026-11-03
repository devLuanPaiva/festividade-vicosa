import type { ReactElement } from 'react';
import { Parallax } from '@/components/motion/Parallax';

export function GiantNumber(): ReactElement {
  return (
    <Parallax
      distance={120}
      className="pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 select-none"
    >
      <span
        aria-hidden="true"
        className="outline-text block font-display text-[22rem] leading-none md:text-[34rem]"
      >
        25
      </span>
    </Parallax>
  );
}
