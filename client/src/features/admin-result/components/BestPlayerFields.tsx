import type { ReactElement } from 'react';
import type { Match, Team } from '@/features/games/types';
import type { ResultDraft, ResultDraftChange } from '../types';
import { TeamChoice } from './TeamChoice';

interface BestPlayerFieldsProps {
  match: Match;
  teams: Team[];
  draft: ResultDraft;
  nameError: string | null;
  onChange: ResultDraftChange;
}

function keptPhotoKey(match: Match, draftName: string): string {
  const recorded = match.bestPlayer;
  return recorded && recorded.name === draftName ? (recorded.photoKey ?? '') : '';
}

export function BestPlayerFields({
  match,
  teams,
  draft,
  nameError,
  onChange,
}: BestPlayerFieldsProps): ReactElement {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-admin-line bg-admin-surface p-4">
      <h2 className="text-base font-bold">Melhor jogador (opcional)</h2>
      <label className="flex flex-col gap-2 text-sm font-semibold">
        Nome
        <input
          name="bestPlayerName"
          value={draft.bestPlayerName}
          onChange={(event) => onChange('bestPlayerName', event.target.value)}
          autoComplete="off"
          maxLength={120}
          aria-invalid={nameError ? true : undefined}
          className="min-h-12 rounded-xl border border-admin-line bg-white px-4 text-base font-normal outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
        />
        {nameError ? (
          <span role="alert" className="font-normal text-danger">
            {nameError}
          </span>
        ) : null}
      </label>
      <input
        type="hidden"
        name="bestPlayerPhotoKey"
        value={keptPhotoKey(match, draft.bestPlayerName)}
      />
      <TeamChoice
        legend="Time do jogador"
        name="bestPlayerTeamId"
        teams={teams}
        value={draft.bestPlayerTeamId}
        onChange={(teamId) => onChange('bestPlayerTeamId', teamId)}
      />
    </section>
  );
}
