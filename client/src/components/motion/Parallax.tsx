'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef, type ReactElement, type ReactNode } from 'react';

interface ParallaxProps {
  children: ReactNode;
  distance?: number;
  className?: string;
}

export function Parallax({ children, distance = 70, className }: ParallaxProps): ReactElement {
  const elementRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: elementRef,
    offset: ['start end', 'end start'],
  });
  const translateY = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <div ref={elementRef} className={className}>
      <motion.div style={{ y: shouldReduceMotion ? 0 : translateY }}>{children}</motion.div>
    </div>
  );
}
