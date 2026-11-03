import type { ReactElement, ReactNode } from 'react';

type TooltipSide = 'right' | 'bottom';

const SIDE_CLASSES: Record<TooltipSide, string> = {
  right: 'left-full top-1/2 ml-2 -translate-y-1/2',
  bottom: 'left-1/2 top-full mt-2 -translate-x-1/2',
};

interface TooltipProps {
  label: string;
  children: ReactNode;
  side?: TooltipSide;
  isDisabled?: boolean;
  className?: string;
}

export function Tooltip({
  label,
  children,
  side = 'bottom',
  isDisabled = false,
  className = '',
}: TooltipProps): ReactElement {
  if (isDisabled) {
    return <>{children}</>;
  }
  return (
    <span className={`group/tip relative inline-flex ${className}`}>
      {children}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute z-50 hidden whitespace-nowrap rounded-lg bg-admin-ink px-2.5 py-1.5 text-xs font-semibold text-white shadow-lg group-has-[:focus-visible]/tip:block group-hover/tip:block ${SIDE_CLASSES[side]}`}
      >
        {label}
      </span>
    </span>
  );
}
