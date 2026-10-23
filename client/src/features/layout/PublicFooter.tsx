import Image from 'next/image';
import type { ReactElement } from 'react';
import prefectureLogo from '@/assets/LOGOTIPOS/logotipo-prefeitura/logo-prefeitura-de-vicosa-branco-oficial.png';
import { Container } from './Container';

export function PublicFooter(): ReactElement {
  return (
    <footer className="surface-deep border-t border-white/10">
      <Container className="flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <Image src={prefectureLogo} alt="Prefeitura de Viçosa" className="h-10 w-auto" />
        <p className="max-w-md text-sm text-white/70">
          Festividade de Emancipação Política de Viçosa/RN. Realização da Prefeitura Municipal e da
          Secretaria de Cultura, Turismo, Esporte e Lazer.
        </p>
      </Container>
    </footer>
  );
}
