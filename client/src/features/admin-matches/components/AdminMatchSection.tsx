import type { ReactElement } from 'react';
import type { MatchListItem } from '@/features/games/types';
import { AdminMatchRow } from './AdminMatchRow';

interface AdminMatchSectionProps {
  title: string;
  emptyMessage?: string;
  matches: MatchListItem[];
}

export function AdminMatchSection({
  title,
  emptyMessage,
  matches,
}: AdminMatchSectionProps): ReactElement | null {
  if (matches.length === 0 && !emptyMessage) {
    return null;
  }
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-bold">{title}</h2>
      {matches.length === 0 ? (
        <p className="text-sm text-admin-muted">{emptyMessage}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {matches.map((match) => (
            <li key={match.id}>
              <AdminMatchRow match={match} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
