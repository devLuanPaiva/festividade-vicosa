'use client';

import type { PointerEvent, ReactElement, ReactNode } from 'react';

interface PointerSpotlightProps {
  children: ReactNode;
  className?: string;
}

export function PointerSpotlight({ children, className }: PointerSpotlightProps): ReactElement {
  function followPointer(event: PointerEvent<HTMLDivElement>): void {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--mx', `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty('--my', `${event.clientY - bounds.top}px`);
  }

  return (
    <div className={`relative ${className ?? ''}`} onPointerMove={followPointer}>
      <div aria-hidden="true" className="spotlight pointer-events-none absolute inset-0" />
      {children}
    </div>
  );
}
