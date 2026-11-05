import { Logger } from '@nestjs/common';
import type { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { CategoryService } from '../../resources/category/services/category.service';
import { EditionService } from '../../resources/edition/services/edition.service';
import { MatchGroupService } from '../../resources/match-group/services/match-group.service';
import { MatchService } from '../../resources/match/services/match.service';
import { SubEventService } from '../../resources/sub-event/services/sub-event.service';
import { TeamService } from '../../resources/team/services/team.service';
import { buildCategoryPlans } from './demo-plans';
import type { CategoryPlan } from './demo-types';

export const TRAINING_YEAR = 2026;
export const TRAINING_SLUG_PREFIX = 'treino-';
export const TRAINING_GROUP_NAME = 'Treino';
export const TEAMS_PER_CATEGORY = 4;

export interface TrainingServices {
  teams: TeamService;
  groups: MatchGroupService;
  matches: MatchService;
}

export interface TrainingContext {
  services: TrainingServices;
  plans: CategoryPlan[];
  logger: Logger;
  close: () => Promise<void>;
}

async function loadPlans(app: INestApplicationContext): Promise<CategoryPlan[]> {
  return buildCategoryPlans(
    {
      editions: app.get(EditionService, { strict: false }),
      subEvents: app.get(SubEventService, { strict: false }),
      categories: app.get(CategoryService, { strict: false }),
    },
    TRAINING_YEAR,
  );
}

export async function openTrainingContext(name: string): Promise<TrainingContext> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['warn', 'error'],
  });
  return {
    services: {
      teams: app.get(TeamService, { strict: false }),
      groups: app.get(MatchGroupService, { strict: false }),
      matches: app.get(MatchService, { strict: false }),
    },
    plans: await loadPlans(app),
    logger: new Logger(name),
    close: () => app.close(),
  };
}

export function runTraining(name: string, task: () => Promise<void>): void {
  task().catch((error: unknown) => {
    new Logger(name).error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
