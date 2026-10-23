'use client';

import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, type ReactElement } from 'react';
import prefectureLogo from '@/assets/LOGOTIPOS/logotipo-prefeitura/logo-prefeitura-de-vicosa-branco-oficial.png';
import { Container } from './Container';
import { MobileMenu } from './MobileMenu';
import { publicNavigation } from './navigation';

const SCROLLED_THRESHOLD_PIXELS = 24;

const linkClassName =
  'relative flex min-h-11 items-center rounded-full px-4 text-sm font-medium text-white/90 transition-colors hover:bg-white/15 hover:text-white';

export function PublicHeader(): ReactElement {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();

  useMotionValueEvent(scrollY, 'change', (offset) => {
    setIsScrolled(offset > SCROLLED_THRESHOLD_PIXELS);
  });

  const surfaceClassName =
    isScrolled || isMenuOpen
      ? 'bg-brand-900/95 shadow-[0_4px_24px_rgba(7,59,134,0.35)] backdrop-blur'
      : 'bg-transparent';

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${surfaceClassName}`}
    >
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" aria-label="Festividade de Viçosa, página inicial">
          <Image src={prefectureLogo} alt="Prefeitura de Viçosa" className="h-8 w-auto" priority />
        </Link>
        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {publicNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClassName}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((current) => !current)}
          className="flex size-11 items-center justify-center rounded-full text-white hover:bg-white/15 md:hidden"
        >
          <span className="sr-only">{isMenuOpen ? 'Fechar menu' : 'Abrir menu'}</span>
          <span aria-hidden="true" className="font-display text-3xl leading-none">
            {isMenuOpen ? '×' : '≡'}
          </span>
        </button>
      </Container>
      <MobileMenu isOpen={isMenuOpen} onNavigate={() => setIsMenuOpen(false)} />
      <motion.div
        aria-hidden="true"
        style={{ scaleX: scrollYProgress }}
        className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-sun"
      />
    </header>
  );
}
