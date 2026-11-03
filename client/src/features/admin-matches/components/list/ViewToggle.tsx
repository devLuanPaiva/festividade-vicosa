import Link from 'next/link';
import type { ReactElement } from 'react';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Tooltip } from '@/components/ui/Tooltip';
import { buildMatchListHref, type MatchListQuery, type ViewMode } from '../../lib/match-list-query';

interface ViewToggleProps {
  query: MatchListQuery;
}

const VIEWS: { mode: ViewMode; label: string; icon: IconName }[] = [
  { mode: 'tabela', label: 'Ver em tabela', icon: 'table' },
  { mode: 'cards', label: 'Ver em cards', icon: 'grid' },
];

export function ViewToggle({ query }: ViewToggleProps): ReactElement {
  const effective: ViewMode = query.view === 'cards' ? 'cards' : 'tabela';
  return (
    <div role="group" aria-label="Modo de exibição" className="hidden gap-1 md:flex">
      {VIEWS.map(({ mode, label, icon }) => {
        const isActive = effective === mode;
        return (
          <Tooltip key={mode} label={label}>
            <Link
              href={buildMatchListHref(query, { view: mode })}
              aria-label={label}
              aria-pressed={isActive}
              className={`inline-flex size-11 items-center justify-center rounded-xl border transition-colors ${isActive ? 'border-brand-600 bg-brand-600 text-white' : 'border-admin-line bg-white hover:border-brand-500'}`}
            >
              <Icon name={icon} />
            </Link>
          </Tooltip>
        );
      })}
    </div>
  );
}
