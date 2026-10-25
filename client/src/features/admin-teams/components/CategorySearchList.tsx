'use client';

import Link from 'next/link';
import { useState, type ReactElement } from 'react';
import { EmptyState } from '@/components/feedback/EmptyState';
import { filterCategories } from '../lib/filter-categories';
import { categoryPath } from '../lib/admin-team-paths';
import type { ModalityCategories } from '../types';

interface CategorySearchListProps {
  modalities: ModalityCategories[];
}

function EmptyResult({ onClear }: { onClear: () => void }): ReactElement {
  return (
    <EmptyState
      tone="admin"
      icon="search"
      title="Nenhuma categoria encontrada"
      description="Tente outro nome ou limpe a busca para ver todas."
    >
      <button
        type="button"
        onClick={onClear}
        className="inline-flex min-h-11 items-center rounded-xl border border-admin-line px-4 text-sm font-semibold hover:border-brand-500"
      >
        Limpar busca
      </button>
    </EmptyState>
  );
}

export function CategorySearchList({ modalities }: CategorySearchListProps): ReactElement {
  const [search, setSearch] = useState('');
  const visible = filterCategories(modalities, search);

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-2 text-sm font-semibold">
        Buscar categoria
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          autoComplete="off"
          className="min-h-12 rounded-xl border border-admin-line bg-white px-4 text-base font-normal outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
        />
      </label>
      <div className="overflow-hidden rounded-2xl border border-admin-line bg-admin-surface">
        {visible.length === 0 ? <EmptyResult onClear={() => setSearch('')} /> : null}
        {visible.map((modality) => (
          <section key={modality.modalityLabel} aria-label={modality.modalityLabel}>
            <h2 className="border-b border-admin-line bg-admin-canvas px-4 py-2 text-xs font-bold uppercase tracking-wide text-admin-muted">
              {modality.modalityLabel}
            </h2>
            <ul className="divide-y divide-admin-line">
              {modality.categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={categoryPath(category.id)}
                    className="flex min-h-14 items-center justify-between gap-3 px-4 font-semibold text-brand-700 hover:bg-admin-canvas"
                  >
                    {category.label}
                    <span aria-hidden="true" className="text-admin-muted">
                      ›
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
