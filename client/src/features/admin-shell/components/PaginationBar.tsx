import Link from 'next/link';
import type { ReactElement } from 'react';
import { buildPageItems } from '@/lib/pagination/page-items';
import { PAGE_SIZE_OPTIONS } from '@/lib/pagination/page-size';
import { PageSizeSelect } from './PageSizeSelect';

const BUTTON_CLASS =
  'inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border px-3 text-sm font-semibold';
const ENABLED_CLASS = `${BUTTON_CLASS} border-admin-line bg-white hover:border-brand-500`;
const DISABLED_CLASS = `${BUTTON_CLASS} cursor-not-allowed border-admin-line bg-admin-canvas text-admin-muted`;
const CURRENT_CLASS = `${BUTTON_CLASS} border-brand-600 bg-brand-600 text-white`;
const OUTER_PAGE_CLASS = 'hidden sm:inline-flex';

interface PaginationBarProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  noun: { singular: string; plural: string };
  hrefFor: (changes: { page?: number; pageSize?: number }) => string;
}

function Step({ label, href }: { label: string; href: string | null }): ReactElement {
  return href ? (
    <Link href={href} className={ENABLED_CLASS}>
      {label}
    </Link>
  ) : (
    <span aria-disabled="true" className={DISABLED_CLASS}>
      {label}
    </span>
  );
}

export function PaginationBar({
  page,
  totalPages,
  total,
  pageSize,
  noun,
  hrefFor,
}: PaginationBarProps): ReactElement {
  const previous = page > 1 ? hrefFor({ page: page - 1 }) : null;
  const next = page < totalPages ? hrefFor({ page: page + 1 }) : null;
  return (
    <nav
      aria-label="Paginação"
      className="flex flex-wrap items-center justify-between gap-3 border-t border-admin-line px-4 py-3"
    >
      <p className="text-sm text-admin-muted">
        Página {page} de {totalPages} · {total} {total === 1 ? noun.singular : noun.plural}
      </p>
      <PageSizeSelect
        current={pageSize}
        choices={PAGE_SIZE_OPTIONS.map((size) => ({
          size,
          href: hrefFor({ page: 1, pageSize: size }),
        }))}
      />
      <div className="flex flex-wrap items-center gap-2">
        <Step label="Anterior" href={previous} />
        {buildPageItems(page, totalPages).map((item) =>
          item.page === page ? (
            <span key={item.page} aria-current="page" className={CURRENT_CLASS}>
              {item.page}
            </span>
          ) : (
            <Link
              key={item.page}
              href={hrefFor({ page: item.page })}
              aria-label={`Ir para a página ${item.page}`}
              className={`${ENABLED_CLASS} ${item.isOuter ? OUTER_PAGE_CLASS : ''}`}
            >
              {item.page}
            </Link>
          ),
        )}
        <Step label="Próxima" href={next} />
      </div>
    </nav>
  );
}
