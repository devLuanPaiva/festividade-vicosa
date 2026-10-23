'use client';

import { motion, useReducedMotion } from 'motion/react';
import { Fragment, type ReactElement } from 'react';

type HeadingTag = 'h1' | 'h2' | 'h3' | 'p';

const WORD_STAGGER_SECONDS = 0.07;
const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: WORD_STAGGER_SECONDS } },
};

const wordVariants = {
  hidden: { y: '115%', rotate: 4 },
  visible: { y: '0%', rotate: 0, transition: { duration: 0.9, ease: EASE_OUT_EXPO } },
};

interface RevealTextProps {
  text: string;
  as?: HeadingTag;
  id?: string;
  className?: string;
  playOnLoad?: boolean;
  delay?: number;
}

export function RevealText({
  text,
  as: Tag = 'h2',
  id,
  className,
  playOnLoad = false,
  delay = 0,
}: RevealTextProps): ReactElement {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <Tag id={id} className={className}>
        {text}
      </Tag>
    );
  }

  const trigger = playOnLoad
    ? { animate: 'visible' }
    : { whileInView: 'visible', viewport: { once: true, margin: '0px 0px -15% 0px' } };

  return (
    <Tag id={id} className={className} aria-label={text}>
      <motion.span
        aria-hidden="true"
        className="block"
        initial="hidden"
        variants={containerVariants}
        transition={{ delayChildren: delay }}
        {...trigger}
      >
        {text.split(' ').map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            <span className="inline-block overflow-hidden pb-[0.1em] align-bottom">
              <motion.span className="inline-block origin-bottom-left" variants={wordVariants}>
                {word}
              </motion.span>
            </span>{' '}
          </Fragment>
        ))}
      </motion.span>
    </Tag>
  );
}
