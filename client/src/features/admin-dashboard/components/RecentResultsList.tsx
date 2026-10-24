import Link from 'next/link';
import type { ReactElement } from 'react';
import { ADMIN_MATCHES_PATH } from '@/features/admin-shell/lib/admin-sections';
import { describeElapsed } from '../lib/elapsed-time';
import { describeScore } from '../lib/result-line';
import type { RecentResult } from '../types';

interface RecentResultsListProps {
  results: RecentResult[];
  now: Date;
}

function ResultRow({ result, now }: { result: RecentResult; now: Date }): ReactElement {
  const author = result.finalizedByName ? ` · por ${result.finalizedByName}` : '';
  return (
    <li>
      <Link
        href={`${ADMIN_MATCHES_PATH}/${result.matchId}`}
        className="flex min-h-16 flex-col justify-center gap-0.5 px-4 py-2 transition-colors hover:bg-admin-canvas"
      >
        <span className="flex items-baseline justify-between gap-3">
          <span className="min-w-0 font-semibold">
            {result.teamAName} <span className="text-admin-muted">x</span> {result.teamBName}
          </span>
          <span className="shrink-0 font-bold tabular-nums">{describeScore(result)}</span>
        </span>
        <span className="truncate text-sm text-admin-muted">
          {result.categoryName} · {describeElapsed(result.finalizedAt, now)}
          {author}
        </span>
      </Link>
    </li>
  );
}

export function RecentResultsList({ results, now }: RecentResultsListProps): ReactElement {
  return (
    <section
      aria-labelledby="recent-results-title"
      className="overflow-hidden rounded-2xl border border-admin-line bg-admin-surface"
    >
      <h2 id="recent-results-title" className="px-4 pb-3 pt-4 text-lg font-bold">
        Últimos resultados lançados
      </h2>
      {results.length === 0 ? (
        <p className="border-t border-admin-line px-4 py-5 text-sm text-admin-muted">
          Nenhum resultado lançado ainda. Eles aparecem aqui assim que a equipe finalizar a primeira
          partida.
        </p>
      ) : (
        <ul className="divide-y divide-admin-line border-t border-admin-line">
          {results.map((result) => (
            <ResultRow key={result.matchId} result={result} now={now} />
          ))}
        </ul>
      )}
    </section>
  );
}
