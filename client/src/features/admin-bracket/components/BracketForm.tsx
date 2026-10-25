'use client';

import type { ReactElement } from 'react';
import type { SelectOption } from '@/components/ui/SelectField';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { SuggestionReviewForm } from '@/features/admin-suggestions/components/SuggestionReviewForm';
import { useBracketForm } from '../hooks/use-bracket-form';
import { BRACKET_ERROR_FIELD, type SeededTeam } from '../types';
import { SeedRow } from './SeedRow';

interface BracketFormProps {
  categoryId: string;
  seeding: SeededTeam[];
  teamOptions: SelectOption[];
  returnPath: string;
}

export function BracketForm({
  categoryId,
  seeding,
  teamOptions,
  returnPath,
}: BracketFormProps): ReactElement {
  const form = useBracketForm(categoryId, seeding);
  const seedsError = form.errorFor(BRACKET_ERROR_FIELD);

  if (form.state.rows) {
    return (
      <SuggestionReviewForm
        target={{ categoryId, returnPath }}
        rows={form.state.rows}
        teamOptions={teamOptions}
        submitLabel="Criar chaveamento"
      />
    );
  }
  return (
    <form action={form.formAction} className="flex flex-col gap-5">
      <p className="text-sm text-admin-muted">
        Informe a ordem dos cabeças de chave (1 é o melhor) e deixe em branco quem fica de fora. O
        chaveamento aceita 2, 4, 8, 16 ou 32 times: o 1º enfrenta o último, o 2º o penúltimo, e
        assim por diante. Em seguida você revisa a sugestão antes de criar.
      </p>
      <ul className="divide-y divide-admin-line overflow-hidden rounded-2xl border border-admin-line bg-admin-surface">
        {seeding.map((team) => (
          <SeedRow
            key={team.teamId}
            team={team}
            defaultSeed={form.state.values.positions[team.teamId] ?? ''}
            onInput={form.touch(BRACKET_ERROR_FIELD)}
          />
        ))}
      </ul>
      {seedsError ? (
        <p role="alert" className="text-sm font-semibold text-danger">
          {seedsError}
        </p>
      ) : null}
      {form.otherError ? (
        <p role="alert" className="rounded-xl bg-danger/10 p-4 text-sm font-semibold text-danger">
          {form.otherError}
        </p>
      ) : null}
      <SubmitButton pendingLabel="Gerando sugestão…" className="min-h-12 self-start px-6">
        Ver sugestão de chaveamento
      </SubmitButton>
    </form>
  );
}
