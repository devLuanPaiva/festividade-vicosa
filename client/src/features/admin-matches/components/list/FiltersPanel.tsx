'use client';

import Form from 'next/form';
import Link from 'next/link';
import { useRef, type ReactElement } from 'react';
import { Icon } from '@/components/ui/Icon';
import { ADMIN_MATCHES_PATH } from '@/features/admin-shell/lib/admin-sections';
import type { ModalityCategories } from '@/features/admin-teams/types';
import type { DayOption } from '../../lib/match-list-options';
import type { FormField } from '../../lib/match-list-query';
import { FilterSelects } from './FilterSelects';

interface FiltersPanelProps {
  modalities: ModalityCategories[];
  days: DayOption[];
  selected: { categoryId: string; stage: string; day: string };
  fields: FormField[];
  activeCount: number;
}

function PanelHeader({ onClose }: { onClose: () => void }): ReactElement {
  return (
    <header className="flex items-center justify-between border-b border-admin-line px-5 py-3">
      <h2 className="text-lg font-bold">Filtros</h2>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar filtros"
        className="inline-flex size-11 items-center justify-center rounded-xl hover:bg-admin-canvas"
      >
        <Icon name="close" />
      </button>
    </header>
  );
}

function PanelFooter({ onClose }: { onClose: () => void }): ReactElement {
  return (
    <footer className="flex gap-3 border-t border-admin-line p-4">
      <Link
        href={ADMIN_MATCHES_PATH}
        onClick={onClose}
        className="inline-flex min-h-12 items-center rounded-xl border border-admin-line px-5 font-semibold hover:border-brand-500"
      >
        Limpar tudo
      </Link>
      <button
        type="submit"
        className="min-h-12 flex-1 rounded-xl bg-brand-600 px-5 font-semibold text-white hover:bg-brand-700"
      >
        Aplicar filtros
      </button>
    </footer>
  );
}

export function FiltersPanel({
  modalities,
  days,
  selected,
  fields,
  activeCount,
}: FiltersPanelProps): ReactElement {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const close = (): void => dialogRef.current?.close();
  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-admin-line bg-white px-4 text-sm font-semibold transition-colors hover:border-brand-500"
      >
        Filtros
        {activeCount > 0 ? (
          <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs text-white">
            {activeCount}
          </span>
        ) : null}
      </button>
      <dialog
        ref={dialogRef}
        aria-label="Filtros das partidas"
        className="fixed inset-y-0 left-auto right-0 m-0 h-dvh max-h-none w-full max-w-md bg-admin-surface p-0 text-admin-ink shadow-xl backdrop:bg-black/40"
      >
        <Form action={ADMIN_MATCHES_PATH} onSubmit={close} className="flex h-full flex-col">
          {fields.map((field) => (
            <input key={field.name} type="hidden" name={field.name} value={field.value} />
          ))}
          <PanelHeader onClose={close} />
          <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-5">
            <FilterSelects modalities={modalities} days={days} selected={selected} />
          </div>
          <PanelFooter onClose={close} />
        </Form>
      </dialog>
    </>
  );
}
