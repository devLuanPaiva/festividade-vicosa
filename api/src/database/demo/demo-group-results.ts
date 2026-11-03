import { MatchResultType } from '../../resources/match/enums/match.enums';
import type { RecordResultDto } from '../../resources/match/dto/record-result.dto';
import type { CreatedFixture } from './demo-group-stage';
import { buildPlayedResult, generateScore } from './demo-results';
import { WALKOVER_CATEGORIES } from './demo-scenarios';
import type { CategoryPlan, DemoContext } from './demo-types';

const PARTIAL_LAST_ROUND_INDEX = 1;

function shouldPlay(plan: CategoryPlan, fixture: CreatedFixture): boolean {
  if (plan.progress === 'SCHEDULED') {
    return false;
  }
  return plan.progress !== 'PARTIAL' || fixture.roundIndex <= PARTIAL_LAST_ROUND_INDEX;
}

function buildGroupResult(
  context: DemoContext,
  plan: CategoryPlan,
  fixture: CreatedFixture,
): RecordResultDto {
  const input = {
    random: context.random,
    sport: plan.sport,
    gender: plan.gender,
    teamIds: fixture,
  };
  return buildPlayedResult(input, generateScore(context.random, plan.sport));
}

function buildWalkover(fixture: CreatedFixture): RecordResultDto {
  return { resultType: MatchResultType.WALKOVER, walkoverWinnerId: fixture.teamAId };
}

export async function playGroupFixtures(
  context: DemoContext,
  plan: CategoryPlan,
  fixtures: CreatedFixture[],
): Promise<number> {
  const playable = fixtures.filter(
    (fixture) => fixture.categoryId === plan.categoryId && shouldPlay(plan, fixture),
  );
  const hasWalkover = WALKOVER_CATEGORIES.has(`${plan.sport}:${plan.name}`);
  for (const [index, fixture] of playable.entries()) {
    const result =
      hasWalkover && index === 0
        ? buildWalkover(fixture)
        : buildGroupResult(context, plan, fixture);
    await context.services.results.record(fixture.matchId, context.actorId, result);
  }
  return playable.length;
}
