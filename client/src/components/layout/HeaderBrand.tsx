import Image from 'next/image';
import Link from 'next/link';
import type { ReactElement } from 'react';
import jocevLogo from '@/assets/LOGOTIPOS/jocevs-2026/jocevs_texto_branco.png';

export function HeaderBrand(): ReactElement {
  return (
    <Link
      href="/"
      aria-label="Festividade de Viçosa, página inicial"
      className="inline-flex min-h-11 items-center"
    >
      <Image
        src={jocevLogo}
        alt="JOCEV’S, Jornada Cultural e Esportiva de Viçosa, 25 anos de emoções"
        className="h-16 w-auto"
        priority
      />
    </Link>
  );
}
