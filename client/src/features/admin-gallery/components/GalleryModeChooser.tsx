import Link from 'next/link';
import type { ReactElement } from 'react';
import { Icon, type IconName } from '@/components/ui/Icon';
import { subEventDaysPath, subEventMatchesPath } from '../lib/admin-gallery-paths';

interface ModeOption {
  icon: IconName;
  title: string;
  description: string;
  href: string;
}

function buildOptions(subEventId: string): ModeOption[] {
  return [
    {
      icon: 'calendar',
      title: 'Por dia',
      description: 'Fotos gerais de cada dia do evento. As das partidas do dia aparecem junto.',
      href: subEventDaysPath(subEventId),
    },
    {
      icon: 'ball',
      title: 'Por partidas',
      description: 'Escolha o jogo para enviar as fotos da partida e a foto do melhor jogador.',
      href: subEventMatchesPath(subEventId),
    },
  ];
}

interface GalleryModeChooserProps {
  subEventId: string;
}

export function GalleryModeChooser({ subEventId }: GalleryModeChooserProps): ReactElement {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {buildOptions(subEventId).map((option) => (
        <li key={option.href}>
          <Link
            href={option.href}
            className="group flex h-full items-start gap-4 rounded-2xl border border-admin-line bg-admin-surface p-5 transition-colors hover:border-brand-500"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
              <Icon name={option.icon} className="size-6" />
            </span>
            <span className="flex flex-col gap-1">
              <span className="text-lg font-bold">{option.title}</span>
              <span className="text-sm text-admin-muted">{option.description}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
