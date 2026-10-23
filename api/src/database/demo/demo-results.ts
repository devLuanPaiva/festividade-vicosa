import type { RecordResultDto } from '../../resources/match/dto/record-result.dto';
import { buildAvatarUrl, FEMALE_FIRST_NAMES, MALE_FIRST_NAMES, SURNAMES } from './demo-catalog';
import type { DemoSport } from './demo-photos';
import type { Random } from './demo-random';
import type { DemoGender } from './demo-types';

const FUTSAL_GOALS = { min: 0, max: 7 };
const HANDBALL_GOALS = { min: 17, max: 34 };
const BEST_PLAYER_PROBABILITY = 0.75;
const SHOOTOUT_SCORE = 2;
const SHOOTOUT_PENALTIES = { winner: 4, loser: 3 };

export interface Score {
  scoreA: number;
  scoreB: number;
}

export interface PlayedResultInput {
  random: Random;
  sport: DemoSport;
  gender: DemoGender;
  teamIds: { teamAId: string; teamBId: string };
}

export function generateScore(random: Random, sport: DemoSport): Score {
  const range = sport === 'FUTSAL' ? FUTSAL_GOALS : HANDBALL_GOALS;
  return { scoreA: random.int(range.min, range.max), scoreB: random.int(range.min, range.max) };
}

export function generateDecidedScore(random: Random, sport: DemoSport): Score {
  const score = generateScore(random, sport);
  if (score.scoreA !== score.scoreB) {
    return score;
  }
  return random.chance(0.5)
    ? { scoreA: score.scoreA + 1, scoreB: score.scoreB }
    : { scoreA: score.scoreA, scoreB: score.scoreB + 1 };
}

export function buildPlayerName(random: Random, gender: DemoGender): string {
  const firstNames = gender === 'FEMALE' ? FEMALE_FIRST_NAMES : MALE_FIRST_NAMES;
  return `${random.pick(firstNames)} ${random.pick(SURNAMES)}`;
}

function buildBestPlayer(input: PlayedResultInput): Partial<RecordResultDto> {
  if (!input.random.chance(BEST_PLAYER_PROBABILITY)) {
    return {};
  }
  const name = buildPlayerName(input.random, input.gender);
  const { teamAId, teamBId } = input.teamIds;
  return {
    bestPlayerName: name,
    bestPlayerPhotoKey: buildAvatarUrl(name),
    bestPlayerTeamId: input.random.chance(0.5) ? teamAId : teamBId,
  };
}

export function buildPlayedResult(input: PlayedResultInput, score: Score): RecordResultDto {
  return { ...score, ...buildBestPlayer(input) };
}

export function buildShootoutResult(input: PlayedResultInput): RecordResultDto {
  return {
    scoreA: SHOOTOUT_SCORE,
    scoreB: SHOOTOUT_SCORE,
    penaltiesA: SHOOTOUT_PENALTIES.winner,
    penaltiesB: SHOOTOUT_PENALTIES.loser,
    ...buildBestPlayer(input),
  };
}
