'use client';

import type { ReactElement } from 'react';
import { FormFooter } from '@/components/ui/FormFooter';
import { useBracketForm } from '../hooks/use-bracket-form';
import { BRACKET_ERROR_FIELD, type SeededTeam } from '../types';
import { BracketScheduleFields } from './BracketScheduleFields';
import { SeedRow } from './SeedRow';

interface BracketFormProps {
  categoryId: string;
  seeding: SeededTeam[];
  cancelHref: string;
}

export function BracketForm({ categoryId, seeding, cancelHref }: BracketFormProps): ReactElement {
  const form = useBracketForm(categoryId, seeding);
  const seedsError = form.errorFor(BRACKET_ERROR_FIELD);

  return (
    <form action={form.formAction} className="flex flex-col gap-5">
      <p className="text-sm text-admin-muted">
        Informe a ordem dos cabeças de chave (1 é o melhor) e deixe em branco quem fica de fora. O
        chaveamento aceita 2, 4, 8 ou 16 times: o 1º enfrenta o último, o 2º o penúltimo, e assim
        por diante.
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
      <BracketScheduleFields form={form} />
      {form.otherError ? (
        <p role="alert" className="rounded-xl bg-danger/10 p-4 text-sm font-semibold text-danger">
          {form.otherError}
        </p>
      ) : null}
      <FormFooter cancelHref={cancelHref} submitLabel="Gerar chaveamento" />
    </form>
  );
}
