import type { ReactElement } from 'react';
import { CountUp } from '@/components/motion/CountUp';
import type { Stat } from '../../data/home-content';

interface StatItemProps {
  stat: Stat;
}

export function StatItem({ stat }: StatItemProps): ReactElement {
  return (
    <div className="border-l-4 border-sun pl-4">
      <dt className="sr-only">{stat.label}</dt>
      <dd>
        <CountUp
          value={stat.value}
          className="block font-display text-7xl leading-none text-sun md:text-8xl"
        />
        <span className="mt-2 block max-w-[16ch] text-sm text-white/80">{stat.label}</span>
      </dd>
    </div>
  );
}
