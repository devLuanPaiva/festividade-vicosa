import type { ReactElement } from 'react';
import { formatDayHeading, formatMatchTime } from '../lib/match-dates';
import { categoryLabel, stageLabel } from '../lib/match-labels';
import type { MatchDetail } from '../services/get-match-detail';

interface FactProps {
  label: string;
  value: string;
}

function Fact({ label, value }: FactProps): ReactElement {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-[0_10px_30px_rgba(7,59,134,0.12)]">
      <dt className="text-xs font-semibold uppercase tracking-wider text-brand-600">{label}</dt>
      <dd className="mt-1 text-lg font-semibold text-brand-900 first-letter:uppercase">{value}</dd>
    </div>
  );
}

interface MatchFactsProps {
  detail: MatchDetail;
}

export function MatchFacts({ detail }: MatchFactsProps): ReactElement {
  const { match, category, groupName } = detail;
  return (
    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Fact label="Categoria" value={categoryLabel(category)} />
      <Fact label="Fase" value={stageLabel(match, groupName ?? undefined)} />
      <Fact
        label="Data e hora"
        value={`${formatDayHeading(match.scheduledAt)}, ${formatMatchTime(match.scheduledAt)}`}
      />
      <Fact label="Local" value={match.location ?? 'A definir'} />
    </dl>
  );
}
