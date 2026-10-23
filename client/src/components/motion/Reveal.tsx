'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactElement, ReactNode } from 'react';

export type RevealDirection = 'up' | 'left' | 'right' | 'scale';

const HIDDEN_STATES = {
  up: { opacity: 0, y: 40 },
  left: { opacity: 0, x: -56 },
  right: { opacity: 0, x: 56 },
  scale: { opacity: 0, scale: 0.88 },
};

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

interface RevealProps {
  children: ReactNode;
  direction?: RevealDirection;
  delay?: number;
  className?: string;
}

export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  className,
}: RevealProps): ReactElement {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={HIDDEN_STATES[direction]}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.85, delay, ease: EASE_OUT_EXPO }}
    >
      {children}
    </motion.div>
  );
}
