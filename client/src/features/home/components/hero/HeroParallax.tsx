'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef, type ReactElement, type ReactNode } from 'react';

interface HeroParallaxProps {
  children: ReactNode;
  className?: string;
}

export function HeroParallax({ children, className }: HeroParallaxProps): ReactElement {
  const elementRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: elementRef,
    offset: ['start start', 'end start'],
  });
  const translateY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <motion.div
      ref={elementRef}
      className={className}
      style={shouldReduceMotion ? undefined : { y: translateY, opacity }}
    >
      {children}
    </motion.div>
  );
}
