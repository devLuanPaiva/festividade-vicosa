import { MatchStage } from '../enums/match.enums';
import { problem, type RuleProblem } from './rule-problem';

export interface ResultMatchShape {
  stage: MatchStage;
  teamAId: string;
  teamBId: string;
}

export interface ResultInputShape {
  scoreA: number;
  scoreB: number;
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

export function findResultProblem(
  match: ResultMatchShape,
  input: ResultInputShape,
): RuleProblem | null {
  return checkPenalties(match, input) ?? checkBestPlayer(match, input);
}

function pickWinner(match: ResultMatchShape, teamAWins: boolean): string {
  return teamAWins ? match.teamAId : match.teamBId;
}

export function resolveWinnerId(match: ResultMatchShape, input: ResultInputShape): string | null {
  if (input.scoreA !== input.scoreB) {
    return pickWinner(match, input.scoreA > input.scoreB);
  }
  return hasPenalties(input)
    ? pickWinner(match, (input.penaltiesA ?? 0) > (input.penaltiesB ?? 0))
    : null;
}
