export const POSITION_FIELD_PREFIX = 'position-';

export type OrderedTeamsResult = { ok: true; teamIds: string[] } | { ok: false; message: string };

export const INVALID_POSITION_MESSAGE = 'Use só números inteiros a partir de 1 nas posições.';
export const BROKEN_SEQUENCE_MESSAGE =
  'As posições precisam ser seguidas a partir de 1, sem repetir nem pular (1, 2, 3...).';

function isValidPosition(position: number): boolean {
  return Number.isInteger(position) && position >= 1;
}

export function orderTeamsByPosition(positions: Record<string, string>): OrderedTeamsResult {
  const filled = Object.entries(positions)
    .filter(([, value]) => value !== '')
    .map(([teamId, value]) => ({ teamId, position: Number(value) }));
  if (!filled.every(({ position }) => isValidPosition(position))) {
    return { ok: false, message: INVALID_POSITION_MESSAGE };
  }
  const sorted = [...filled].sort((first, second) => first.position - second.position);
  if (!sorted.every(({ position }, index) => position === index + 1)) {
    return { ok: false, message: BROKEN_SEQUENCE_MESSAGE };
  }
  return { ok: true, teamIds: sorted.map(({ teamId }) => teamId) };
}

export function readPositions(formData: FormData): Record<string, string> {
  const positions: Record<string, string> = {};
  for (const [name, value] of formData.entries()) {
    if (name.startsWith(POSITION_FIELD_PREFIX) && typeof value === 'string') {
      positions[name.slice(POSITION_FIELD_PREFIX.length)] = value.trim();
    }
  }
  return positions;
}
