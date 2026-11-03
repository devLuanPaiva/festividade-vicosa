import { MatchRound, MatchStatus, MatchStage } from '../../resources/match/enums/match.enums';
import type { Match } from '../../resources/match/entities/match.entity';
import { VENUES } from './demo-catalog';
import type { GroupSetup } from './demo-group-stage';
import { addDays, toBrazilDateTime } from './demo-fixtures';
import { buildPlayedResult, buildShootoutResult, generateDecidedScore } from './demo-results';
import { isFirstShootoutCategory } from './demo-scenarios';
import type { CategoryPlan, DemoContext } from './demo-types';

const QUALIFIED_PER_GROUP = 2;
const KNOCKOUT_DAY_OFFSET: Record<CategoryPlan['sport'], number> = { HANDBALL: 2, FUTSAL: 7 };
const FINAL_DAY_OFFSET: Record<CategoryPlan['sport'], number> = { HANDBALL: 2, FUTSAL: 10 };
const MAX_KNOCKOUT_PASSES = 4;

function knockoutDate(plan: CategoryPlan): string {
  return addDays(plan.firstDate, KNOCKOUT_DAY_OFFSET[plan.sport]);
}

export async function confirmQualified(context: DemoContext, groups: GroupSetup[]): Promise<void> {
  for (const group of groups) {
    const rows = await context.services.standings.getByGroup(group.groupId);
    const ordered = [...rows].sort((first, second) => first.position - second.position);
    const teamIds = ordered.slice(0, QUALIFIED_PER_GROUP).map((row) => row.teamId);
    await context.services.qualification.confirm(group.groupId, teamIds);
  }
}

export async function generateBracket(context: DemoContext, plan: CategoryPlan): Promise<void> {
  const seeding = await context.services.standings.listSeeding(plan.categoryId);
  const suggested = await context.services.suggestions.suggestFirstRound(
    plan.categoryId,
    seeding.map((team) => team.teamId),
  );
  await context.services.batch.createMany(plan.categoryId, {
    matches: suggested.map((match) => ({
      stage: MatchStage.KNOCKOUT,
      round: match.round,
      bracketPosition: match.bracketPosition,
      teamAId: match.teamAId,
      teamBId: match.teamBId,
      scheduledAt: toBrazilDateTime(knockoutDate(plan), '14:00:00'),
      location: VENUES[plan.sport][0],
    })),
  });
}

async function confirmNextMatches(context: DemoContext, plan: CategoryPlan): Promise<void> {
  const suggested = await context.services.suggestions.suggestNextMatches(plan.categoryId);
  const missing = suggested.filter((match) => match.matchId === null);
  if (missing.length === 0) {
    return;
  }
  await context.services.batch.createMany(plan.categoryId, {
    matches: missing.map((match) => ({
      stage: MatchStage.KNOCKOUT,
      round: match.round,
      bracketPosition: match.bracketPosition,
      teamAId: match.teamAId,
      teamBId: match.teamBId,
      scheduledAt: match.scheduledAt ?? toBrazilDateTime(knockoutDate(plan), '14:00:00'),
    })),
  });
}

function finalSchedule(plan: CategoryPlan, match: Match): string | undefined {
  const date = addDays(plan.firstDate, FINAL_DAY_OFFSET[plan.sport]);
  if (match.round === MatchRound.FINAL) {
    return toBrazilDateTime(date, '18:00:00');
  }
  return match.round === MatchRound.THIRD_PLACE ? toBrazilDateTime(date, '16:00:00') : undefined;
}

interface PendingMatch {
  plan: CategoryPlan;
  match: Match;
  isShootout: boolean;
}

async function playPendingMatch(context: DemoContext, pending: PendingMatch): Promise<void> {
  const { plan, match, isShootout } = pending;
  const scheduledAt = finalSchedule(plan, match);
  if (scheduledAt) {
    await context.services.matches.update(match.id, { scheduledAt });
  }
  const input = { random: context.random, sport: plan.sport, gender: plan.gender, teamIds: match };
  const result = isShootout
    ? buildShootoutResult(input)
    : buildPlayedResult(input, generateDecidedScore(context.random, plan.sport));
  await context.services.results.record(match.id, context.actorId, result);
}

async function playKnockoutPass(
  context: DemoContext,
  plan: CategoryPlan,
  playedCount: number,
): Promise<number> {
  const pending = await context.services.matches.listByCategory(plan.categoryId, {
    stage: MatchStage.KNOCKOUT,
    status: MatchStatus.SCHEDULED,
  });
  let counter = playedCount;
  for (const match of pending) {
    const isShootout = counter === 0 && isFirstShootoutCategory(plan.sport, plan.name);
    await playPendingMatch(context, { plan, match, isShootout });
    counter++;
  }
  return counter;
}

export async function playKnockout(context: DemoContext, plan: CategoryPlan): Promise<void> {
  let played = 0;
  for (let pass = 0; pass < MAX_KNOCKOUT_PASSES; pass++) {
    const next = await playKnockoutPass(context, plan, played);
    await confirmNextMatches(context, plan);
    if (next === played) {
      return;
    }
    played = next;
  }
}
