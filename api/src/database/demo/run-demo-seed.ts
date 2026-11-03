import { Logger } from '@nestjs/common';
import type { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { CategoryService } from '../../resources/category/services/category.service';
import { EditionService } from '../../resources/edition/services/edition.service';
import { MatchGroupService } from '../../resources/match-group/services/match-group.service';
import { BracketSuggestionService } from '../../resources/match/services/bracket-suggestion.service';
import { MatchBatchService } from '../../resources/match/services/match-batch.service';
import { MatchResultService } from '../../resources/match/services/match-result.service';
import { MatchService } from '../../resources/match/services/match.service';
import { QualificationService } from '../../resources/qualification/services/qualification.service';
import { StandingService } from '../../resources/standing/services/standing.service';
import { SubEventService } from '../../resources/sub-event/services/sub-event.service';
import { TeamService } from '../../resources/team/services/team.service';
import { UserRepository } from '../../resources/user/repository/user.repository';
import { buildCategoryPlans } from './demo-plans';
import { createRandom } from './demo-random';
import { resetDemoData, seedDemoData } from './demo-seeder';
import type { DemoContext } from './demo-types';

const FESTIVAL_YEAR = 2026;
const RANDOM_SEED = 2026;
const RESET_FLAG = '--reset';
const PRODUCTION = 'production';

type Constructor<T> = new (...args: never[]) => T;
type Getter = <T>(type: Constructor<T>) => T;

async function findActorId(get: Getter): Promise<string> {
  const [actor] = await get(UserRepository).findAll({ active: true });
  if (!actor) {
    throw new Error(
      'Nenhum usuário ativo encontrado. Crie o administrador com npm run create:admin.',
    );
  }
  return actor.id;
}

async function buildContext(app: INestApplicationContext, logger: Logger): Promise<DemoContext> {
  const get: Getter = (type) => app.get(type, { strict: false });
  return {
    actorId: await findActorId(get),
    random: createRandom(RANDOM_SEED),
    log: (message: string): void => {
      logger.log(message);
    },
    services: {
      groups: get(MatchGroupService),
      teams: get(TeamService),
      matches: get(MatchService),
      results: get(MatchResultService),
      batch: get(MatchBatchService),
      suggestions: get(BracketSuggestionService),
      qualification: get(QualificationService),
      standings: get(StandingService),
    },
  };
}

function assertNotProduction(): void {
  if (process.env.NODE_ENV === PRODUCTION) {
    throw new Error('O seed de demonstração não roda em produção.');
  }
}

function loadPlans(get: Getter): ReturnType<typeof buildCategoryPlans> {
  const sources = {
    editions: get(EditionService),
    subEvents: get(SubEventService),
    categories: get(CategoryService),
  };
  return buildCategoryPlans(sources, FESTIVAL_YEAR);
}

async function main(): Promise<void> {
  assertNotProduction();
  const logger = new Logger('DemoSeed');
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'warn', 'error'],
  });
  const context = await buildContext(app, logger);
  const plans = await loadPlans((type) => app.get(type, { strict: false }));
  if (process.argv.includes(RESET_FLAG)) {
    await resetDemoData(context, plans);
  }
  await seedDemoData(context, plans);
  await app.close();
}

main().catch((error: unknown) => {
  new Logger('DemoSeed').error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
