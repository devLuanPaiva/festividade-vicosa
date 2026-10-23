import Image from 'next/image';
import Link from 'next/link';
import type { ReactElement } from 'react';
import prefectureLogo from '@/assets/LOGOTIPOS/logotipo-prefeitura/logo-prefeitura-de-vicosa-branco-oficial.png';
import { WaveEdge } from '@/components/ui/WaveEdge';
import { Container } from './Container';
import { publicNavigation } from './navigation';

export function PublicFooter(): ReactElement {
  return (
    <footer className="surface-deep mt-0">
      <WaveEdge />
      <Container className="grid gap-10 py-16 md:grid-cols-[1.2fr_1fr]">
        <div>
          <Image src={prefectureLogo} alt="Prefeitura de Viçosa" className="h-12 w-auto" />
          <p className="mt-5 max-w-md text-sm text-white/70">
            Festividade de Emancipação Política de Viçosa/RN. Realização da Prefeitura Municipal e
            da Secretaria de Cultura, Turismo, Esporte e Lazer.
          </p>
        </div>
        <nav aria-label="Rodapé">
          <ul className="grid grid-cols-2 gap-x-6">
            {publicNavigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex min-h-11 items-center text-white/80 transition-colors hover:text-sun"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </footer>
  );
}
