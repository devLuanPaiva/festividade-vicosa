import { pairKey } from './pair-key';

export interface FixtureSuggestion {
  round: number;
  teamAId: string;
  teamBId: string;
}

type Slot = string | null;

function rotate(slots: Slot[]): Slot[] {
  const [fixed = null, ...rest] = slots;
  const last = rest[rest.length - 1] ?? null;
  return [fixed, last, ...rest.slice(0, -1)];
}

function pairRound(slots: Slot[], round: number): FixtureSuggestion[] {
  const half = slots.length / 2;
  return slots.slice(0, half).flatMap((teamAId, index) => {
    const teamBId = slots[slots.length - 1 - index] ?? null;
    return teamAId && teamBId ? [{ round, teamAId, teamBId }] : [];
  });
}

export function buildRoundRobin(teamIds: string[]): FixtureSuggestion[] {
  const slots: Slot[] = teamIds.length % 2 === 0 ? [...teamIds] : [...teamIds, null];
  const rounds = Math.max(slots.length - 1, 0);
  const fixtures: FixtureSuggestion[] = [];
  let current = slots;
  for (let round = 1; round <= rounds; round += 1) {
    fixtures.push(...pairRound(current, round));
    current = rotate(current);
  }
  return fixtures;
}

export function suggestMissingFixtures(
  teamIds: string[],
  existingPairs: [string, string][],
): FixtureSuggestion[] {
  const played = new Set(existingPairs.map(([first, second]) => pairKey(first, second)));
  return buildRoundRobin(teamIds).filter(
    ({ teamAId, teamBId }) => !played.has(pairKey(teamAId, teamBId)),
  );
}
