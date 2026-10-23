import type { ReactElement, ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className = '' }: ContainerProps): ReactElement {
  return <div className={`mx-auto w-[90%] max-w-(--width-content) ${className}`}>{children}</div>;
}
