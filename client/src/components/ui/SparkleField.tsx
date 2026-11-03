import type { CSSProperties, ReactElement } from 'react';
import { Sparkle } from './Sparkle';

interface SparkleSpec {
  left: string;
  top: string;
  size: number;
  delay: number;
  tone: 'sun' | 'white';
}

const SPARKLES: SparkleSpec[] = [
  { left: '4%', top: '14%', size: 22, delay: 0, tone: 'sun' },
  { left: '14%', top: '62%', size: 14, delay: 1.1, tone: 'white' },
  { left: '27%', top: '30%', size: 10, delay: 2.2, tone: 'white' },
  { left: '41%', top: '78%', size: 18, delay: 0.6, tone: 'white' },
  { left: '55%', top: '12%', size: 12, delay: 1.7, tone: 'sun' },
  { left: '68%', top: '48%', size: 9, delay: 2.6, tone: 'white' },
  { left: '78%', top: '22%', size: 16, delay: 0.3, tone: 'white' },
  { left: '88%', top: '68%', size: 24, delay: 1.4, tone: 'sun' },
  { left: '94%', top: '10%', size: 11, delay: 2.9, tone: 'white' },
  { left: '8%', top: '88%', size: 11, delay: 3.1, tone: 'sun' },
];

const TONE_CLASS_NAMES = { sun: 'text-sun', white: 'text-white' };

export function SparkleField(): ReactElement {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {SPARKLES.map((sparkle) => {
        const style: CSSProperties = {
          left: sparkle.left,
          top: sparkle.top,
          width: sparkle.size,
          height: sparkle.size,
          animationDelay: `${sparkle.delay}s`,
        };
        return (
          <Sparkle
            key={`${sparkle.left}-${sparkle.top}`}
            className={`absolute animate-twinkle ${TONE_CLASS_NAMES[sparkle.tone]}`}
            style={style}
          />
        );
      })}
    </div>
  );
}
