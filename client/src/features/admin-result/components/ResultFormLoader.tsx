import type { ReactElement } from 'react';
import { NoPermission } from '@/features/admin-shell/components/NoPermission';
import { formatMatchTime } from '@/features/games/lib/match-dates';
import { categoryLabel, stageLabel } from '@/features/games/lib/match-labels';
import { fetchMatchDetail } from '@/features/games/services/get-match-detail';
import { orNotFound } from '@/lib/api/missing-resource';
import { requireCurrentUser } from '@/lib/auth/current-user';
import { hasPermission } from '@/lib/auth/permissions';
import { ResultForm } from './ResultForm';

interface ResultFormLoaderProps {
  params: Promise<{ matchId: string }>;
}

export async function ResultFormLoader({ params }: ResultFormLoaderProps): Promise<ReactElement> {
  const user = await requireCurrentUser();
  if (!hasPermission(user, 'match:record-score')) {
    return <NoPermission action="lançar placares" />;
  }
  const { matchId } = await params;
  const detail = await orNotFound(fetchMatchDetail(matchId));
  const { match, teamA, teamB, category, groupName } = detail;
  return (
    <>
      <header className="flex flex-col gap-1">
        <p className="text-sm text-admin-muted">
          {categoryLabel(category)} · {stageLabel(match, groupName ?? undefined)} ·{' '}
          {formatMatchTime(match.scheduledAt)}
        </p>
        <h1 className="text-2xl font-bold">
          {teamA.name} x {teamB.name}
        </h1>
      </header>
      <ResultForm detail={detail} />
    </>
  );
}
