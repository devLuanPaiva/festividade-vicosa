'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import type { PointerEvent, ReactElement, ReactNode } from 'react';

const MAX_TILT_DEGREES = 9;
const SPRING = { stiffness: 220, damping: 22 };

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

export function TiltCard({ children, className }: TiltCardProps): ReactElement {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(
    useTransform(pointerY, [-0.5, 0.5], [MAX_TILT_DEGREES, -MAX_TILT_DEGREES]),
    SPRING,
  );
  const rotateY = useSpring(
    useTransform(pointerX, [-0.5, 0.5], [-MAX_TILT_DEGREES, MAX_TILT_DEGREES]),
    SPRING,
  );

  function followPointer(event: PointerEvent<HTMLDivElement>): void {
    if (event.pointerType !== 'mouse') {
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  }

  function resetTilt(): void {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onPointerMove={followPointer}
      onPointerLeave={resetTilt}
    >
      {children}
    </motion.div>
  );
}
