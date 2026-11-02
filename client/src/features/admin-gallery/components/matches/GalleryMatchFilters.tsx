import Form from 'next/form';
import Link from 'next/link';
import type { ReactElement, ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import type { StatusFilter } from '@/features/admin-matches/lib/match-list-query';
import { DEFAULT_PAGE_SIZE } from '@/lib/pagination/page-size';
import { subEventMatchesPath } from '../../lib/admin-gallery-paths';
import type { GalleryMatchQuery, GalleryMatchView } from '../../lib/gallery-match-view';
import { buildGalleryMatchesHref } from '../../lib/gallery-match-href';

const STATUS_OPTIONS: [StatusFilter, string][] = [
  ['todas', 'Todas'],
  ['hoje', 'Hoje'],
  ['atrasadas', 'Sem resultado'],
  ['agendadas', 'Agendadas'],
  ['finalizadas', 'Finalizadas'],
];

interface GalleryMatchFiltersProps {
  subEventId: string;
  view: GalleryMatchView;
}

interface ChipProps {
  href: string;
  isActive: boolean;
  children: ReactNode;
}

function Chip({ href, isActive, children }: ChipProps): ReactElement {
  const tone = isActive
    ? 'border-brand-600 bg-brand-600 text-white'
    : 'border-admin-line bg-admin-surface hover:border-brand-500';
  return (
    <Link
      href={href}
      aria-current={isActive ? 'true' : undefined}
      className={`inline-flex min-h-10 shrink-0 items-center whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition-colors ${tone}`}
    >
      {children}
    </Link>
  );
}

function ChipRow({ label, children }: { label: string; children: ReactNode }): ReactElement {
  return (
    <div role="group" aria-label={label} className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-admin-muted">
        {label}
      </span>
      <div className="-mx-4 flex gap-2 overflow-x-auto scrollbar-hidden px-4 pb-1">{children}</div>
    </div>
  );
}

function SearchField({
  subEventId,
  query,
}: {
  subEventId: string;
  query: GalleryMatchQuery;
}): ReactElement {
  return (
    <Form
      action={subEventMatchesPath(subEventId)}
      role="search"
      className="flex min-h-12 items-center rounded-xl border border-admin-line bg-white focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/30"
    >
      {query.categoryId ? <input type="hidden" name="categoria" value={query.categoryId} /> : null}
      {query.day ? <input type="hidden" name="dia" value={query.day} /> : null}
      {query.pageSize !== DEFAULT_PAGE_SIZE ? (
        <input type="hidden" name="itens" value={query.pageSize} />
      ) : null}
      {query.status !== 'todas' ? (
        <input type="hidden" name="situacao" value={query.status} />
      ) : null}
      <label htmlFor="gallery-match-search" className="pl-3 pr-2 text-admin-muted">
        <span className="sr-only">Buscar partida</span>
        <Icon name="search" />
      </label>
      <input
        id="gallery-match-search"
        name="q"
        type="search"
        defaultValue={query.search}
        placeholder="Buscar por time, categoria ou local"
        autoComplete="off"
        className="min-h-12 min-w-0 flex-1 bg-transparent pr-3 text-base outline-none"
      />
      <button type="submit" className="min-h-12 px-4 text-sm font-semibold text-brand-700">
        Buscar
      </button>
    </Form>
  );
}

export function GalleryMatchFilters({ subEventId, view }: GalleryMatchFiltersProps): ReactElement {
  const { query, categories, days } = view;
  const hrefFor = (changes: Partial<GalleryMatchQuery>): string =>
    buildGalleryMatchesHref(subEventId, { ...query, page: 1, ...changes });
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-admin-line bg-admin-surface p-4">
      <SearchField subEventId={subEventId} query={query} />
      <ChipRow label="Situação">
        {STATUS_OPTIONS.map(([status, label]) => (
          <Chip key={status} href={hrefFor({ status })} isActive={query.status === status}>
            {label}
          </Chip>
        ))}
      </ChipRow>
      <ChipRow label="Categoria">
        <Chip href={hrefFor({ categoryId: '' })} isActive={query.categoryId === ''}>
          Todas
        </Chip>
        {categories.map((category) => (
          <Chip
            key={category.value}
            href={hrefFor({ categoryId: category.value })}
            isActive={query.categoryId === category.value}
          >
            {category.label}
          </Chip>
        ))}
      </ChipRow>
      <ChipRow label="Dia">
        <Chip href={hrefFor({ day: '' })} isActive={query.day === ''}>
          Todos
        </Chip>
        {days.map((day) => (
          <Chip
            key={day.value}
            href={hrefFor({ day: day.value })}
            isActive={query.day === day.value}
          >
            {day.label}
          </Chip>
        ))}
      </ChipRow>
    </div>
  );
}
