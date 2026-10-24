import { notFound } from 'next/navigation';
import type { ReactElement } from 'react';
import { formatMatchTime } from '@/features/games/lib/match-dates';
import { categoryLabel, stageLabel } from '@/features/games/lib/match-labels';
import { fetchMatchDetail, type MatchDetail } from '@/features/games/services/get-match-detail';
import { ApiError } from '@/lib/api/api-response';
import { requireCurrentUser } from '@/lib/auth/current-user';
import { hasPermission } from '@/lib/auth/permissions';
import { ResultForm } from './ResultForm';

const NOT_FOUND_STATUS = 404;
const BAD_REQUEST_STATUS = 400;

interface ResultFormLoaderProps {
  params: Promise<{ matchId: string }>;
}

function isMissingMatch(error: unknown): boolean {
  return (
    error instanceof ApiError &&
    (error.statusCode === NOT_FOUND_STATUS || error.statusCode === BAD_REQUEST_STATUS)
  );
}

async function loadMatchDetail(matchId: string): Promise<MatchDetail> {
  try {
    return await fetchMatchDetail(matchId);
  } catch (error) {
    if (isMissingMatch(error)) {
      notFound();
    }
    throw error;
  }
}

export async function ResultFormLoader({ params }: ResultFormLoaderProps): Promise<ReactElement> {
  const user = await requireCurrentUser();
  if (!hasPermission(user, 'match:record-score')) {
    return <p>Seu usuário não tem permissão para lançar placares.</p>;
  }
  const { matchId } = await params;
  const detail = await loadMatchDetail(matchId);
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
