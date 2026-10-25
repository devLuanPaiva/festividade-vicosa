import type { AlbumTarget } from '../types';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ISO_DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function albumTargetToQuery(target: AlbumTarget): string {
  const params: Record<string, string> =
    target.kind === 'match'
      ? { kind: target.kind, matchId: target.matchId }
      : { kind: target.kind, subEventId: target.subEventId, date: target.date };
  return new URLSearchParams(params).toString();
}

function parseMatchTarget(params: URLSearchParams): AlbumTarget | null {
  const matchId = params.get('matchId') ?? '';
  return UUID_PATTERN.test(matchId) ? { kind: 'match', matchId } : null;
}

function parseEventDayTarget(params: URLSearchParams): AlbumTarget | null {
  const subEventId = params.get('subEventId') ?? '';
  const date = params.get('date') ?? '';
  const isValid = UUID_PATTERN.test(subEventId) && ISO_DAY_PATTERN.test(date);
  return isValid ? { kind: 'event-day', subEventId, date } : null;
}

export function parseAlbumTarget(params: URLSearchParams): AlbumTarget | null {
  const kind = params.get('kind');
  if (kind === 'match') {
    return parseMatchTarget(params);
  }
  return kind === 'event-day' ? parseEventDayTarget(params) : null;
}
