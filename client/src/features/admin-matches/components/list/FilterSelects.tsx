import type { ReactElement, ReactNode } from 'react';
import type { ModalityCategories } from '@/features/admin-teams/types';
import type { DayOption } from '../../lib/match-list-options';

interface FilterSelectsProps {
  modalities: ModalityCategories[];
  days: DayOption[];
  selected: { categoryId: string; stage: string; day: string };
}

const SELECT_CLASS =
  'min-h-12 w-full rounded-xl border border-admin-line bg-white px-4 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30';

interface FilterSelectProps {
  name: string;
  label: string;
  defaultValue: string;
  children: ReactNode;
}

function FilterSelect({ name, label, defaultValue, children }: FilterSelectProps): ReactElement {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={`filter-${name}`} className="text-sm font-semibold">
        {label}
      </label>
      <select
        id={`filter-${name}`}
        name={name}
        defaultValue={defaultValue}
        className={SELECT_CLASS}
      >
        {children}
      </select>
    </div>
  );
}

export function FilterSelects({ modalities, days, selected }: FilterSelectsProps): ReactElement {
  return (
    <>
      <FilterSelect name="categoria" label="Categoria" defaultValue={selected.categoryId}>
        <option value="">Todas as categorias</option>
        {modalities.map((modality) => (
          <optgroup key={modality.modalityLabel} label={modality.modalityLabel}>
            {modality.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </optgroup>
        ))}
      </FilterSelect>
      <FilterSelect name="fase" label="Fase" defaultValue={selected.stage}>
        <option value="todas">Todas as fases</option>
        <option value="grupos">Fase de grupos</option>
        <option value="mata-mata">Mata-mata</option>
      </FilterSelect>
      <FilterSelect name="dia" label="Dia" defaultValue={selected.day}>
        <option value="">Todos os dias</option>
        {days.map((day) => (
          <option key={day.value} value={day.value}>
            {day.label}
          </option>
        ))}
      </FilterSelect>
    </>
  );
}
