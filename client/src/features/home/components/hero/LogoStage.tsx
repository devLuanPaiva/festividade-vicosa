import Image from 'next/image';
import type { ReactElement } from 'react';
import jocevLogo from '@/assets/LOGOTIPOS/jocevs-2026/logotipo-jocevs-2026.png';

const RAYS_BACKGROUND =
  'conic-gradient(from 0deg, transparent, rgb(250 217 14 / 0.65), transparent 38%, rgb(40 206 253 / 0.7), transparent 78%)';

export function LogoStage(): ReactElement {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div
        aria-hidden="true"
        className="absolute -inset-8 animate-spin-slow rounded-full opacity-80 blur-3xl"
        style={{ background: RAYS_BACKGROUND }}
      />
      <div className="relative animate-float rounded-3xl bg-white p-6 shadow-[0_24px_60px_rgba(7,59,134,0.4)] sm:p-8">
        <Image
          src={jocevLogo}
          alt="JOCEV’S, Jornada Cultural e Esportiva de Viçosa, 25 anos de emoções"
          className="h-auto w-full"
          priority
        />
      </div>
    </div>
  );
}
