import { MatchStage, type MatchRound } from '../enums/match.enums';
import { firstRoundFor, maxPositionOf } from './bracket.rule';
import { pairKey } from './pair-key';
import { problem, type RuleProblem } from './rule-problem';

export interface BatchItem {
  stage: MatchStage;
  groupId?: string | null;
  round?: MatchRound | null;
  bracketPosition?: number | null;
  teamAId: string;
  teamBId: string;
}

export interface ExistingMatchShape {
  stage: MatchStage;
  groupId: string | null;
  round: MatchRound | null;
  bracketPosition: number | null;
  teamAId: string;
  teamBId: string;
}

const POSITION_FIELD = 'bracketPosition';
const MAX_FIRST_ROUND_MATCHES = 16;

function slotKey(item: BatchItem | ExistingMatchShape): string {
  return `${item.round}:${item.bracketPosition}`;
}

function groupPairingKey(item: BatchItem | ExistingMatchShape): string {
  return `${item.groupId}:${pairKey(item.teamAId, item.teamBId)}`;
}

function findDuplicate(keys: string[]): string | undefined {
  return keys.find((key, index) => keys.indexOf(key) !== index);
}

function checkGroupPosition(item: BatchItem): RuleProblem | null {
  return item.bracketPosition === undefined || item.bracketPosition === null
    ? null
    : problem(
        'BRACKET_POSITION_NOT_ALLOWED',
        'A fase de grupos não tem posição no chaveamento.',
        POSITION_FIELD,
      );
}

function checkKnockoutPosition(item: BatchItem): RuleProblem | null {
  const position = item.bracketPosition ?? null;
  if (position === null || !item.round) {
    return problem(
      'BRACKET_POSITION_REQUIRED',
      'Informe a posição da partida no chaveamento.',
      POSITION_FIELD,
    );
  }
  return position > maxPositionOf(item.round)
    ? problem(
        'BRACKET_POSITION_OUT_OF_RANGE',
        'A posição informada não existe nesta rodada.',
        POSITION_FIELD,
      )
    : null;
}

function checkItemPosition(item: BatchItem): RuleProblem | null {
  return item.stage === MatchStage.GROUP ? checkGroupPosition(item) : checkKnockoutPosition(item);
}

function checkPositions(items: BatchItem[]): RuleProblem | null {
  return items.map(checkItemPosition).find((found) => found !== null) ?? null;
}

function checkSlots(items: BatchItem[], existing: ExistingMatchShape[]): RuleProblem | null {
  const keys = [...existing, ...items]
    .filter((item) => item.stage === MatchStage.KNOCKOUT && item.bracketPosition !== null)
    .map(slotKey);
  return findDuplicate(keys)
    ? problem(
        'BRACKET_SLOT_TAKEN',
        'Já existe uma partida nesta posição do chaveamento.',
        POSITION_FIELD,
      )
    : null;
}

function checkPairings(items: BatchItem[], existing: ExistingMatchShape[]): RuleProblem | null {
  const keys = [...existing, ...items]
    .filter((item) => item.stage === MatchStage.GROUP)
    .map(groupPairingKey);
  return findDuplicate(keys)
    ? problem('FIXTURE_DUPLICATED', 'Este confronto já existe no grupo.', 'teamBId')
    : null;
}

function isPowerOfTwo(count: number): boolean {
  return count > 0 && (count & (count - 1)) === 0;
}

function isCompleteFirstRound(bracketItems: BatchItem[]): boolean {
  const count = bracketItems.length;
  const positions = bracketItems
    .map((item) => item.bracketPosition ?? -1)
    .sort((first, second) => first - second);
  return (
    isPowerOfTwo(count) &&
    count <= MAX_FIRST_ROUND_MATCHES &&
    positions.every((position, index) => position === index) &&
    bracketItems.every((item) => item.round === firstRoundFor(count * 2))
  );
}

function checkFirstRound(items: BatchItem[], existing: ExistingMatchShape[]): RuleProblem | null {
  const bracketItems = items.filter((item) => item.bracketPosition !== undefined);
  const hasBracket = existing.some((match) => match.bracketPosition !== null);
  if (hasBracket || bracketItems.length === 0 || isCompleteFirstRound(bracketItems)) {
    return null;
  }
  return problem(
    'BRACKET_FIRST_ROUND_INVALID',
    'A primeira rodada do chaveamento precisa ter 1, 2, 4, 8 ou 16 partidas completas.',
    POSITION_FIELD,
  );
}

export function findBatchProblem(
  items: BatchItem[],
  existing: ExistingMatchShape[],
): RuleProblem | null {
  return (
    checkPositions(items) ??
    checkSlots(items, existing) ??
    checkPairings(items, existing) ??
    checkFirstRound(items, existing)
  );
}
