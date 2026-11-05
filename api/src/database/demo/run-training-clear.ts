import type { Team } from '../../resources/team/entities/team.entity';
import type { CategoryPlan } from './demo-types';
import {
  TRAINING_GROUP_NAME,
  TRAINING_SLUG_PREFIX,
  openTrainingContext,
  runTraining,
  type TrainingContext,
} from './training-data';

const SCRIPT_NAME = 'TrainingClear';

function isTrainingTeam(team: Team): boolean {
  return team.slug.startsWith(TRAINING_SLUG_PREFIX);
}

async function removeMatches(
  context: TrainingContext,
  categoryId: string,
  teamIds: Set<string>,
): Promise<void> {
  const matches = await context.services.matches.listByCategory(categoryId, {});
  for (const match of matches) {
    if (teamIds.has(match.teamAId) || teamIds.has(match.teamBId)) {
      await context.services.matches.remove(match.id);
    }
  }
}

async function removeGroups(context: TrainingContext, categoryId: string): Promise<void> {
  const groups = await context.services.groups.listByCategory(categoryId, {});
  for (const group of groups.filter((item) => item.name === TRAINING_GROUP_NAME)) {
    await context.services.groups.remove(group.id);
  }
}

async function clearCategory(context: TrainingContext, plan: CategoryPlan): Promise<void> {
  const teams = (await context.services.teams.listByCategory(plan.categoryId, {})).filter(
    isTrainingTeam,
  );
  await removeMatches(context, plan.categoryId, new Set(teams.map((team) => team.id)));
  for (const team of teams) {
    await context.services.teams.remove(team.id);
  }
  await removeGroups(context, plan.categoryId);
  context.logger.log(`${plan.sport} ${plan.name}: ${teams.length} times de treino removidos.`);
}

async function main(): Promise<void> {
  const context = await openTrainingContext(SCRIPT_NAME);
  try {
    for (const plan of context.plans) {
      await clearCategory(context, plan);
    }
  } finally {
    await context.close();
  }
}

runTraining(SCRIPT_NAME, main);
