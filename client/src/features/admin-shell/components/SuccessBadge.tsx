import type { ReactElement } from 'react';

const CHECK_PATH = 'M7 12.5l3.5 3.5L17.5 8.5';

export function SuccessBadge(): ReactElement {
  return (
    <div aria-hidden="true" className="relative grid size-32 place-items-center md:size-40">
      <span className="absolute inset-0 rounded-full bg-white/30 motion-safe:animate-success-ring" />
      <span className="absolute inset-0 rounded-full bg-white/20 motion-safe:animate-success-ring [animation-delay:1.2s]" />
      <span className="relative grid size-full place-items-center rounded-full bg-white text-success shadow-[0_14px_40px_rgba(0,0,0,0.25)] motion-safe:animate-success-pop">
        <svg viewBox="0 0 24 24" fill="none" className="size-3/5" focusable="false">
          <path
            d={CHECK_PATH}
            pathLength={1}
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={1}
            className="motion-safe:animate-check-draw"
          />
        </svg>
      </span>
    </div>
  );
}
