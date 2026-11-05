import { MatchStage } from '../../resources/match/enums/match.enums';
import { slugify } from '../../common/text/slugify';
import { TEAM_TEMPLATES, VENUES } from './demo-catalog';
import { buildSlots, roundRobinRounds } from './demo-fixtures';
import type { CategoryPlan } from './demo-types';
import {
  TEAMS_PER_CATEGORY,
  TRAINING_GROUP_NAME,
  TRAINING_SLUG_PREFIX,
  openTrainingContext,
  runTraining,
  type TrainingContext,
} from './training-data';

const SCRIPT_NAME = 'TrainingSeed';

async function createTeamIds(
  context: TrainingContext,
  plan: CategoryPlan,
  groupId: string,
): Promise<string[]> {
  const teamIds: string[] = [];
  for (const template of TEAM_TEMPLATES.slice(0, TEAMS_PER_CATEGORY)) {
    const team = await context.services.teams.create(plan.categoryId, {
      ...template,
      slug: `${TRAINING_SLUG_PREFIX}${slugify(template.name)}`,
      groupId,
    });
    teamIds.push(team.id);
  }
  return teamIds;
}

async function createMatches(
  context: TrainingContext,
  plan: CategoryPlan,
  seed: { groupId: string; teamIds: string[] },
): Promise<number> {
  const pairings = roundRobinRounds(seed.teamIds).flat();
  const slots = buildSlots(plan.firstDate, VENUES[plan.sport], pairings.length);
  for (const [index, pairing] of pairings.entries()) {
    await context.services.matches.create(plan.categoryId, {
      stage: MatchStage.GROUP,
      groupId: seed.groupId,
      ...pairing,
      scheduledAt: slots[index]?.scheduledAt ?? '',
      location: slots[index]?.location,
    });
  }
  return pairings.length;
}

async function seedCategory(context: TrainingContext, plan: CategoryPlan): Promise<void> {
  const group = await context.services.groups.create(plan.categoryId, {
    name: TRAINING_GROUP_NAME,
  });
  const teamIds = await createTeamIds(context, plan, group.id);
  const matches = await createMatches(context, plan, { groupId: group.id, teamIds });
  context.logger.log(`${plan.sport} ${plan.name}: ${teamIds.length} times e ${matches} partidas.`);
}

async function main(): Promise<void> {
  const context = await openTrainingContext(SCRIPT_NAME);
  try {
    for (const plan of context.plans) {
      await seedCategory(context, plan);
    }
  } finally {
    await context.close();
  }
}

runTraining(SCRIPT_NAME, main);
