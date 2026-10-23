import { MatchResultType, MatchStage } from '../enums/match.enums';
import type { ResultInputShape, ResultMatchShape } from './result.rule';
import { problem, type RuleProblem } from './rule-problem';

function hasPlayedData(input: ResultInputShape): boolean {
  return [
    input.scoreA,
    input.scoreB,
    input.penaltiesA,
    input.penaltiesB,
    input.bestPlayerName,
    input.bestPlayerPhotoKey,
    input.bestPlayerTeamId,
  ].some((value) => value !== undefined && value !== null);
}

function checkNothingPlayed(input: ResultInputShape): RuleProblem | null {
  return hasPlayedData(input)
    ? problem(
        'WALKOVER_HAS_NO_PLAY',
        'O W.O. não tem placar, pênaltis nem melhor jogador.',
        'scoreA',
      )
    : null;
}

function checkDoubleWalkover(match: ResultMatchShape, input: ResultInputShape): RuleProblem | null {
  if (match.stage === MatchStage.KNOCKOUT) {
    return problem(
      'DOUBLE_WALKOVER_IN_KNOCKOUT',
      'No mata-mata alguém precisa avançar: não há W.O. dos dois times.',
      'resultType',
    );
  }
  return input.walkoverWinnerId
    ? problem(
        'DOUBLE_WALKOVER_WITH_WINNER',
        'No W.O. dos dois times ninguém vence.',
        'walkoverWinnerId',
      )
    : null;
}

function checkWalkoverWinner(match: ResultMatchShape, input: ResultInputShape): RuleProblem | null {
  if (!input.walkoverWinnerId) {
    return problem(
      'WALKOVER_WINNER_REQUIRED',
      'Informe o time que compareceu e venceu por W.O.',
      'walkoverWinnerId',
    );
  }
  return [match.teamAId, match.teamBId].includes(input.walkoverWinnerId)
    ? null
    : problem(
        'WALKOVER_WINNER_INVALID',
        'O vencedor do W.O. deve ser um dos dois times da partida.',
        'walkoverWinnerId',
      );
}

export function findWalkoverProblem(
  match: ResultMatchShape,
  input: ResultInputShape,
): RuleProblem | null {
  const refereeing =
    input.resultType === MatchResultType.DOUBLE_WALKOVER
      ? checkDoubleWalkover(match, input)
      : checkWalkoverWinner(match, input);
  return checkNothingPlayed(input) ?? refereeing;
}
