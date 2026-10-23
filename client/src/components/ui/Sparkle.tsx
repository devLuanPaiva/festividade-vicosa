import type { CSSProperties, ReactElement } from 'react';

interface SparkleProps {
  className?: string;
  style?: CSSProperties;
}

export function Sparkle({ className, style }: SparkleProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      style={style}
      fill="currentColor"
    >
      <path d="M12 0c1 8 4 11 12 12-8 1-11 4-12 12-1-8-4-11-12-12 8-1 11-4 12-12Z" />
    </svg>
  );
}
