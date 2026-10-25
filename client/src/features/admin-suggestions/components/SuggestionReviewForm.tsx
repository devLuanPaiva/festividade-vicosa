'use client';

import type { ReactElement } from 'react';
import { FormFooter } from '@/components/ui/FormFooter';
import { useSuggestionForm } from '../hooks/use-suggestion-form';
import { ROWS_ERROR_FIELD, type SuggestionReviewProps } from '../types';
import { SuggestionDefaultFields } from './SuggestionDefaultFields';
import { SuggestionRowCard } from './SuggestionRowCard';

export function SuggestionReviewForm({
  target,
  rows,
  teamOptions,
  submitLabel,
}: SuggestionReviewProps): ReactElement {
  const form = useSuggestionForm(target, rows);
  const rowsError = form.errorFor(ROWS_ERROR_FIELD);

  return (
    <form action={form.formAction} className="flex flex-col gap-5">
      <p className="rounded-2xl border border-admin-line bg-admin-surface p-4 text-sm text-admin-muted">
        Isto é só uma sugestão. Revise cada partida, troque os times, ajuste data, hora e local, e
        desmarque o que não fizer sentido. Nada é criado até você confirmar.
      </p>
      <input type="hidden" name="rowCount" value={form.state.values.rows.length} />
      <SuggestionDefaultFields defaults={form.state.values.defaults} touch={form.touch} />
      <ul className="flex flex-col gap-4">
        {form.state.values.rows.map((row, index) => (
          <SuggestionRowCard
            key={`${row.round}-${row.bracketPosition}-${row.teamAId}-${row.teamBId}-${row.title}`}
            index={index}
            row={row}
            teamOptions={teamOptions}
            form={form}
          />
        ))}
      </ul>
      {rowsError ? (
        <p role="alert" className="text-sm font-semibold text-danger">
          {rowsError}
        </p>
      ) : null}
      {form.otherError ? (
        <p role="alert" className="rounded-xl bg-danger/10 p-4 text-sm font-semibold text-danger">
          {form.otherError}
        </p>
      ) : null}
      <FormFooter cancelHref={target.returnPath} submitLabel={submitLabel} />
    </form>
  );
}
