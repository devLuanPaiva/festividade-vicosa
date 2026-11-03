'use client';

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react';
import { useEffect, useRef, type ReactElement } from 'react';

const COUNT_DURATION_SECONDS = 2.2;

interface CountUpProps {
  value: number;
  suffix?: string;
  className?: string;
}

export function CountUp({ value, suffix = '', className }: CountUpProps): ReactElement {
  const elementRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(elementRef, { once: true, margin: '0px 0px -10% 0px' });
  const shouldReduceMotion = useReducedMotion();
  const motionValue = useMotionValue(shouldReduceMotion ? value : 0);
  const text = useTransform(motionValue, (latest) => `${Math.round(latest)}${suffix}`);

  useEffect(() => {
    if (!isInView || shouldReduceMotion) {
      return undefined;
    }
    const controls = animate(motionValue, value, {
      duration: COUNT_DURATION_SECONDS,
      ease: 'easeOut',
    });
    return () => controls.stop();
  }, [isInView, shouldReduceMotion, motionValue, value]);

  return (
    <motion.span ref={elementRef} className={className} aria-label={`${value}${suffix}`}>
      {text}
    </motion.span>
  );
}
