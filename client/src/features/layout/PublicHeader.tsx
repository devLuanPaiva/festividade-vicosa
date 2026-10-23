import Image from 'next/image';
import Link from 'next/link';
import { useState, type ReactElement } from 'react';
import prefectureLogo from '@/assets/LOGOTIPOS/logotipo-prefeitura/logo-prefeitura-de-vicosa-branco-oficial.png';
import { Container } from './Container';
import { publicNavigation } from './navigation';

const linkClassName =
  'flex min-h-11 items-center rounded-full px-4 text-sm font-medium text-white/90 transition-colors hover:bg-white/15 hover:text-white';

export function PublicHeader(): ReactElement {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-brand-900/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" aria-label="Festividade de Viçosa — página inicial">
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
          <span aria-hidden="true" className="font-display text-2xl leading-none">
            {isMenuOpen ? '×' : '≡'}
          </span>
        </button>
      </Container>
      {isMenuOpen ? (
        <nav
          id="mobile-navigation"
          aria-label="Principal"
          className="border-t border-white/15 md:hidden"
        >
          <ul className="mx-auto w-[90%] py-2">
            {publicNavigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={linkClassName}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
