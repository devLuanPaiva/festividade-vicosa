import Image from 'next/image';
import type { ReactElement } from 'react';
import { Icon, type IconName } from '@/components/ui/Icon';
import jocevLogo from '@/assets/LOGOTIPOS/jocevs-2026/logotipo-jocevs-2026.png';

interface Highlight {
  icon: IconName;
  text: string;
}

const HIGHLIGHTS: Highlight[] = [
  { icon: 'ball', text: 'Lance placares em poucos toques, direto do celular.' },
  { icon: 'trophy', text: 'Acompanhe a classificação e o chaveamento de cada categoria.' },
  { icon: 'users', text: 'Organize times, grupos e a equipe do campeonato.' },
];

export function LoginBrandPanel(): ReactElement {
  return (
    <section
      aria-label="Festividade de Viçosa"
      className="surface-sky flex flex-col items-center justify-center gap-8 px-6 pb-16 pt-10 text-center lg:items-start lg:px-16 lg:py-16 lg:text-left"
    >
      <div className="w-44 rounded-2xl bg-white p-3 shadow-[0_18px_40px_rgba(7,59,134,0.35)] sm:w-52 lg:w-72 lg:p-5">
        <Image
          src={jocevLogo}
          alt="JOCEV’S, Jornada Cultural e Esportiva de Viçosa, 25 anos de emoções"
          sizes="(min-width: 1024px) 288px, 208px"
          className="h-auto w-full"
          priority
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-display text-4xl tracking-wide text-sun lg:text-6xl">
          Painel da Festividade
        </p>
        <p className="max-w-md text-base text-white/90 lg:text-lg">
          Tudo o que a equipe precisa para tocar o campeonato, do apito inicial ao placar final.
        </p>
      </div>
      <ul className="hidden max-w-md flex-col gap-4 text-left lg:flex">
        {HIGHLIGHTS.map(({ icon, text }) => (
          <li key={text} className="flex items-start gap-3 text-white/95">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
              <Icon name={icon} />
            </span>
            <span className="pt-2 text-sm">{text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
