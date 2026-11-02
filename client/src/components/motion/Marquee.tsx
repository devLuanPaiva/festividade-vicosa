import type { ReactElement } from 'react';
import { Sparkle } from '@/components/ui/Sparkle';

interface MarqueeProps {
  items: string[];
  reverse?: boolean;
  className?: string;
}

export function Marquee({ items, reverse = false, className = '' }: MarqueeProps): ReactElement {
  const loopedItems = [...items, ...items];
  const animationClassName = reverse ? 'animate-marquee-reverse' : 'animate-marquee';

  return (
    <div aria-hidden="true" className={`flex overflow-hidden pt-[0.2em] ${className}`}>
      <ul className={`flex w-max shrink-0 items-center ${animationClassName}`}>
        {loopedItems.map((item, index) => (
          <li key={`${item}-${index}`} className="flex items-center gap-6 pr-6">
            <span>{item}</span>
            <Sparkle className="size-5" />
          </li>
        ))}
      </ul>
    </div>
  );
}
