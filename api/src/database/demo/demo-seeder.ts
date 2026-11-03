import { playGroupFixtures } from './demo-group-results';
import {
  seedGroupFixtures,
  seedGroupsAndTeams,
  type CategoryGroups,
  type CreatedFixture,
} from './demo-group-stage';
import { confirmQualified, generateBracket, playKnockout } from './demo-knockout';
import type { CategoryPlan, DemoContext, DemoProgress } from './demo-types';

const QUALIFIED_PROGRESS: DemoProgress[] = ['GROUPS_DONE', 'BRACKET_READY', 'FINISHED'];

async function finishCategory(
  context: DemoContext,
  entry: CategoryGroups,
  fixtures: CreatedFixture[],
): Promise<void> {
  const { plan, groups } = entry;
  const played = await playGroupFixtures(context, plan, fixtures);
  context.log(`${plan.sport} ${plan.name}: ${played} jogos da fase de grupos (${plan.progress}).`);
  if (!QUALIFIED_PROGRESS.includes(plan.progress)) {
    return;
  }
  await confirmQualified(context, groups);
  if (plan.progress === 'GROUPS_DONE') {
    return;
  }
  await generateBracket(context, plan);
  if (plan.progress === 'FINISHED') {
    await playKnockout(context, plan);
  }
}

async function seedSport(context: DemoContext, plans: CategoryPlan[]): Promise<void> {
  const entries: CategoryGroups[] = [];
  for (const plan of plans) {
    entries.push({ plan, groups: await seedGroupsAndTeams(context, plan) });
  }
  const fixtures = await seedGroupFixtures(context, entries);
  context.log(`${plans[0]?.sport}: ${fixtures.length} partidas agendadas.`);
  for (const entry of entries) {
    await finishCategory(context, entry, fixtures);
  }
}

async function assertNothingSeeded(context: DemoContext, plans: CategoryPlan[]): Promise<void> {
  for (const plan of plans) {
    const teams = await context.services.teams.listByCategory(plan.categoryId, {});
    if (teams.length > 0) {
      throw new Error(
        `A categoria ${plan.name} já tem times. Rode com --reset para recriar os dados de demonstração.`,
      );
    }
  }
}

export async function seedDemoData(context: DemoContext, plans: CategoryPlan[]): Promise<void> {
  await assertNothingSeeded(context, plans);
  const sports = [...new Set(plans.map((plan) => plan.sport))];
  for (const sport of sports) {
    await seedSport(
      context,
      plans.filter((plan) => plan.sport === sport),
    );
  }
}

async function resetCategory(context: DemoContext, categoryId: string): Promise<void> {
  const { matches, teams, groups } = context.services;
  for (const match of await matches.listByCategory(categoryId, {})) {
    await matches.remove(match.id);
  }
  for (const team of await teams.listByCategory(categoryId, {})) {
    await teams.remove(team.id);
  }
  for (const group of await groups.listByCategory(categoryId, {})) {
    await groups.remove(group.id);
  }
}

export async function resetDemoData(context: DemoContext, plans: CategoryPlan[]): Promise<void> {
  for (const plan of plans) {
    await resetCategory(context, plan.categoryId);
  }
  context.log('Partidas, times e grupos das categorias foram apagados.');
}
