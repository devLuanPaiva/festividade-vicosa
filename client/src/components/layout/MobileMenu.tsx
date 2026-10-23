'use client';

import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { publicNavigation } from './navigation';

interface MobileMenuProps {
  isOpen: boolean;
  onNavigate: () => void;
}

export function MobileMenu({ isOpen, onNavigate }: MobileMenuProps): ReactElement {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.nav
          id="mobile-navigation"
          aria-label="Principal"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="overflow-hidden border-t border-white/15 md:hidden"
        >
          <ul className="mx-auto w-[90%] py-3">
            {publicNavigation.map((item, index) => (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className="flex min-h-12 items-center font-display text-3xl text-white"
                >
                  {item.label}
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.nav>
      ) : null}
    </AnimatePresence>
  );
}
