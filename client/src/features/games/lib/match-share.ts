import type { MatchDetail } from '../services/get-match-detail';
import { formatDayHeading, formatMatchTime } from './match-dates';
import { categoryLabel, stageLabel } from './match-labels';
import { getMatchOutcome } from './match-outcome';

export interface MatchShare {
  title: string;
  description: string;
}

function penaltiesNote(detail: MatchDetail): string | null {
  const { penaltiesA, penaltiesB } = detail.match;
  return penaltiesA === null || penaltiesB === null
    ? null
    : `${penaltiesA}-${penaltiesB} nos pênaltis`;
}

function buildTitle(detail: MatchDetail): string {
  const { match, teamA, teamB } = detail;
  if (match.status === 'SCHEDULED') {
    return `${teamA.name} x ${teamB.name}`;
  }
  const { sideA, sideB } = getMatchOutcome(match);
  return `${teamA.name} ${sideA.score} x ${sideB.score} ${teamB.name}`;
}

function buildStatusLine(detail: MatchDetail): string {
  const { match } = detail;
  if (match.status === 'SCHEDULED') {
    const day = formatDayHeading(match.scheduledAt);
    return [`${day}, ${formatMatchTime(match.scheduledAt)}`, match.location]
      .filter(Boolean)
      .join(' · ');
  }
  return [getMatchOutcome(match).note, penaltiesNote(detail)].filter(Boolean).join(' · ');
}

export function buildMatchShare(detail: MatchDetail): MatchShare {
  const stage = stageLabel(detail.match, detail.groupName ?? undefined);
  const description = [stage, categoryLabel(detail.category), buildStatusLine(detail)]
    .filter(Boolean)
    .join(' · ');
  return { title: buildTitle(detail), description };
}
