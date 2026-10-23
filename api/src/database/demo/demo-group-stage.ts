import { MatchStage } from '../../resources/match/enums/match.enums';
import { TEAM_TEMPLATES, VENUES, type TeamTemplate } from './demo-catalog';
import { buildSlots, roundRobinRounds, type Pairing, type Slot } from './demo-fixtures';
import { TEAM_PHOTOS } from './demo-photos';
import type { CategoryPlan, DemoContext } from './demo-types';

const GROUP_NAMES = ['A', 'B'];
const TEAMS_PER_GROUP = 4;

export interface GroupSetup {
  groupId: string;
  teamIds: string[];
}

export interface CategoryGroups {
  plan: CategoryPlan;
  groups: GroupSetup[];
}

export interface CreatedFixture extends Pairing {
  matchId: string;
  categoryId: string;
  groupId: string;
  roundIndex: number;
}

interface PlannedFixture extends Pairing {
  categoryId: string;
  groupId: string;
  roundIndex: number;
}

async function createTeam(
  context: DemoContext,
  plan: CategoryPlan,
  template: TeamTemplate & { groupId: string; photoIndex: number },
): Promise<string> {
  const photos = TEAM_PHOTOS[plan.sport];
  const team = await context.services.teams.create(plan.categoryId, {
    name: template.name,
    city: template.city,
    abbreviation: template.abbreviation,
    photoKey: photos[template.photoIndex % photos.length]?.url,
    groupId: template.groupId,
  });
  return team.id;
}

async function createGroup(
  context: DemoContext,
  plan: CategoryPlan,
  seed: { name: string; templates: TeamTemplate[]; photoOffset: number },
): Promise<GroupSetup> {
  const group = await context.services.groups.create(plan.categoryId, { name: seed.name });
  const teamIds: string[] = [];
  for (const [index, template] of seed.templates.entries()) {
    const photoIndex = seed.photoOffset + index;
    teamIds.push(await createTeam(context, plan, { ...template, groupId: group.id, photoIndex }));
  }
  return { groupId: group.id, teamIds };
}

export async function seedGroupsAndTeams(
  context: DemoContext,
  plan: CategoryPlan,
): Promise<GroupSetup[]> {
  const templates = context.random.shuffle(TEAM_TEMPLATES);
  const groups: GroupSetup[] = [];
  for (const [index, name] of GROUP_NAMES.entries()) {
    const start = index * TEAMS_PER_GROUP;
    const groupTemplates = templates.slice(start, start + TEAMS_PER_GROUP);
    groups.push(
      await createGroup(context, plan, { name, templates: groupTemplates, photoOffset: start }),
    );
  }
  return groups;
}

function roundFixtures(entry: CategoryGroups, roundIndex: number): PlannedFixture[] {
  return entry.groups.flatMap((group) => {
    const pairings = roundRobinRounds(group.teamIds)[roundIndex] ?? [];
    const base = { categoryId: entry.plan.categoryId, groupId: group.groupId, roundIndex };
    return pairings.map((pairing) => ({ ...pairing, ...base }));
  });
}

function planFixtures(entries: CategoryGroups[]): PlannedFixture[] {
  const rounds = Array.from({ length: TEAMS_PER_GROUP - 1 }, (_, roundIndex) => roundIndex);
  return rounds.flatMap((roundIndex) =>
    entries.flatMap((entry) => roundFixtures(entry, roundIndex)),
  );
}

async function createFixture(
  context: DemoContext,
  fixture: PlannedFixture,
  slot: Slot | undefined,
): Promise<CreatedFixture> {
  const match = await context.services.matches.create(fixture.categoryId, {
    stage: MatchStage.GROUP,
    groupId: fixture.groupId,
    teamAId: fixture.teamAId,
    teamBId: fixture.teamBId,
    scheduledAt: slot?.scheduledAt ?? '',
    location: slot?.location,
  });
  return { ...fixture, matchId: match.id };
}

export async function seedGroupFixtures(
  context: DemoContext,
  entries: CategoryGroups[],
): Promise<CreatedFixture[]> {
  const [first] = entries;
  if (!first) {
    return [];
  }
  const planned = planFixtures(entries);
  const slots = buildSlots(first.plan.firstDate, VENUES[first.plan.sport], planned.length);
  const created: CreatedFixture[] = [];
  for (const [index, fixture] of planned.entries()) {
    created.push(await createFixture(context, fixture, slots[index]));
  }
  return created;
}
