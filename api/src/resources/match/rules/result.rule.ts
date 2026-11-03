import { MatchResultType, MatchStage } from '../enums/match.enums';
import { problem, type RuleProblem } from './rule-problem';
import { findWalkoverProblem } from './walkover.rule';

export interface ResultMatchShape {
  stage: MatchStage;
  teamAId: string;
  teamBId: string;
}

export interface ResultInputShape {
  resultType?: MatchResultType;
  walkoverWinnerId?: string | null;
  scoreA?: number | null;
  scoreB?: number | null;
  penaltiesA?: number | null;
  penaltiesB?: number | null;
  bestPlayerName?: string | null;
  bestPlayerPhotoKey?: string | null;
  bestPlayerTeamId?: string | null;
}

function hasPenalties({ penaltiesA, penaltiesB }: ResultInputShape): boolean {
  return (
    penaltiesA !== undefined &&
    penaltiesA !== null &&
    penaltiesB !== undefined &&
    penaltiesB !== null
  );
}

function checkPenaltiesPair({ penaltiesA, penaltiesB }: ResultInputShape): RuleProblem | null {
  const hasA = penaltiesA !== undefined && penaltiesA !== null;
  const hasB = penaltiesB !== undefined && penaltiesB !== null;
  return hasA === hasB
    ? null
    : problem('PENALTIES_INCOMPLETE', 'Informe os pênaltis dos dois times.', 'penaltiesB');
}

function checkDecisiveShootout(input: ResultInputShape): RuleProblem | null {
  if (!hasPenalties(input)) {
    return problem(
      'PENALTIES_REQUIRED',
      'No mata-mata o empate é decidido nos pênaltis (RN-22).',
      'penaltiesA',
    );
  }
  return input.penaltiesA === input.penaltiesB
    ? problem('PENALTIES_TIED', 'Os pênaltis precisam definir um vencedor.', 'penaltiesB')
    : null;
}

function checkKnockoutPenalties(input: ResultInputShape): RuleProblem | null {
  if (input.scoreA === input.scoreB) {
    return checkDecisiveShootout(input);
  }
  return hasPenalties(input)
    ? problem(
        'PENALTIES_NOT_ALLOWED',
        'Só há pênaltis quando o jogo termina empatado.',
        'penaltiesA',
      )
    : null;
}

function checkPenalties(match: ResultMatchShape, input: ResultInputShape): RuleProblem | null {
  const incomplete = checkPenaltiesPair(input);
  if (incomplete) {
    return incomplete;
  }
  if (match.stage === MatchStage.GROUP) {
    return hasPenalties(input)
      ? problem(
          'PENALTIES_NOT_ALLOWED',
          'Na fase de grupos o empate vale 1 ponto, sem pênaltis.',
          'penaltiesA',
        )
      : null;
  }
  return checkKnockoutPenalties(input);
}

function checkBestPlayer(match: ResultMatchShape, input: ResultInputShape): RuleProblem | null {
  if (!input.bestPlayerName) {
    return input.bestPlayerPhotoKey || input.bestPlayerTeamId
      ? problem('BEST_PLAYER_NAME_REQUIRED', 'Informe o nome do melhor jogador.', 'bestPlayerName')
      : null;
  }
  const isFromTheMatch = [match.teamAId, match.teamBId].includes(input.bestPlayerTeamId ?? '');
  return isFromTheMatch
    ? null
    : problem(
        'BEST_PLAYER_TEAM_INVALID',
        'O melhor jogador deve ser de um dos dois times da partida (RN-18).',
        'bestPlayerTeamId',
      );
}

function checkScores({ scoreA, scoreB }: ResultInputShape): RuleProblem | null {
  if (scoreA === undefined || scoreA === null) {
    return problem('SCORE_REQUIRED', 'Informe o placar do time A.', 'scoreA');
  }
  return scoreB === undefined || scoreB === null
    ? problem('SCORE_REQUIRED', 'Informe o placar do time B.', 'scoreB')
    : null;
}

function findPlayedProblem(match: ResultMatchShape, input: ResultInputShape): RuleProblem | null {
  return checkScores(input) ?? checkPenalties(match, input) ?? checkBestPlayer(match, input);
}

function isWalkover({ resultType }: ResultInputShape): boolean {
  return resultType !== undefined && resultType !== MatchResultType.PLAYED;
}

export function findResultProblem(
  match: ResultMatchShape,
  input: ResultInputShape,
): RuleProblem | null {
  return isWalkover(input) ? findWalkoverProblem(match, input) : findPlayedProblem(match, input);
}

function pickWinner(match: ResultMatchShape, teamAWins: boolean): string {
  return teamAWins ? match.teamAId : match.teamBId;
}

function scoreDecision({ scoreA, scoreB }: ResultInputShape): number {
  return Math.sign((scoreA ?? 0) - (scoreB ?? 0));
}

function penaltiesDecision(input: ResultInputShape): number {
  return hasPenalties(input) ? Math.sign((input.penaltiesA ?? 0) - (input.penaltiesB ?? 0)) : 0;
}

function resolvePlayedWinnerId(match: ResultMatchShape, input: ResultInputShape): string | null {
  const decision = scoreDecision(input) || penaltiesDecision(input);
  return decision === 0 ? null : pickWinner(match, decision > 0);
}

export function resolveWinnerId(match: ResultMatchShape, input: ResultInputShape): string | null {
  return isWalkover(input) ? (input.walkoverWinnerId ?? null) : resolvePlayedWinnerId(match, input);
}
