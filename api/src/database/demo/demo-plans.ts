import type { CategoryService } from '../../resources/category/services/category.service';
import type { EditionService } from '../../resources/edition/services/edition.service';
import { SubEventType } from '../../resources/sub-event/enums/sub-event-type.enum';
import type { SubEvent } from '../../resources/sub-event/entities/sub-event.entity';
import type { SubEventService } from '../../resources/sub-event/services/sub-event.service';
import type { DemoSport } from './demo-photos';
import { resolveProgress } from './demo-scenarios';
import type { CategoryPlan } from './demo-types';

const SPORT_BY_SUB_EVENT_TYPE: Partial<Record<SubEventType, DemoSport>> = {
  [SubEventType.JOCEV_HANDBALL]: 'HANDBALL',
  [SubEventType.JOCEV_FUTSAL]: 'FUTSAL',
};

export interface PlanSources {
  editions: Pick<EditionService, 'list'>;
  subEvents: Pick<SubEventService, 'listByEdition'>;
  categories: Pick<CategoryService, 'listBySubEvent'>;
}

async function plansOfSubEvent(sources: PlanSources, subEvent: SubEvent): Promise<CategoryPlan[]> {
  const sport = SPORT_BY_SUB_EVENT_TYPE[subEvent.type];
  if (!sport) {
    return [];
  }
  const categories = await sources.categories.listBySubEvent(subEvent.id, {});
  return categories.map((category) => ({
    categoryId: category.id,
    name: category.name,
    gender: category.gender,
    sport,
    progress: resolveProgress(sport, category.name),
    firstDate: subEvent.startDate,
  }));
}

export async function buildCategoryPlans(
  sources: PlanSources,
  year: number,
): Promise<CategoryPlan[]> {
  const [edition] = await sources.editions.list({ year });
  if (!edition) {
    throw new Error(`A edição ${year} não existe. Rode as migrations antes do seed.`);
  }
  const subEvents = await sources.subEvents.listByEdition(edition.id, {});
  const plans: CategoryPlan[] = [];
  for (const subEvent of subEvents) {
    plans.push(...(await plansOfSubEvent(sources, subEvent)));
  }
  return plans;
}
