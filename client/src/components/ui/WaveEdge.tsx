import type { ReactElement } from 'react';

const WAVE_PATH = 'M0 70Q360 8 720 70T1440 70T2160 70T2880 70V120H0Z';

export function WaveEdge(): ReactElement {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-[calc(100%-1px)] left-0 z-10 h-10 w-full overflow-hidden md:h-20"
    >
      <svg
        viewBox="0 0 2880 120"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 h-full w-[200%] animate-wave"
        fill="var(--surface-fill)"
      >
        <path d={WAVE_PATH} />
      </svg>
    </div>
  );
}
