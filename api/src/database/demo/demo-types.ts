import type { MatchGroupService } from '../../resources/match-group/services/match-group.service';
import type { BracketSuggestionService } from '../../resources/match/services/bracket-suggestion.service';
import type { MatchBatchService } from '../../resources/match/services/match-batch.service';
import type { MatchResultService } from '../../resources/match/services/match-result.service';
import type { MatchService } from '../../resources/match/services/match.service';
import type { QualificationService } from '../../resources/qualification/services/qualification.service';
import type { StandingService } from '../../resources/standing/services/standing.service';
import type { TeamService } from '../../resources/team/services/team.service';
import type { Random } from './demo-random';
import type { DemoSport } from './demo-photos';

export type DemoProgress = 'SCHEDULED' | 'PARTIAL' | 'GROUPS_DONE' | 'BRACKET_READY' | 'FINISHED';

export type DemoGender = 'MALE' | 'FEMALE';

export interface DemoServices {
  groups: Pick<MatchGroupService, 'create' | 'listByCategory' | 'remove'>;
  teams: Pick<TeamService, 'create' | 'listByCategory' | 'remove'>;
  matches: Pick<MatchService, 'create' | 'update' | 'listByCategory' | 'remove'>;
  results: Pick<MatchResultService, 'record'>;
  batch: Pick<MatchBatchService, 'createMany'>;
  suggestions: Pick<BracketSuggestionService, 'suggestFirstRound' | 'suggestNextMatches'>;
  qualification: Pick<QualificationService, 'confirm'>;
  standings: Pick<StandingService, 'getByGroup' | 'listSeeding'>;
}

export interface DemoContext {
  services: DemoServices;
  actorId: string;
  random: Random;
  log: (message: string) => void;
}

export interface CategoryPlan {
  categoryId: string;
  name: string;
  gender: DemoGender;
  sport: DemoSport;
  progress: DemoProgress;
  firstDate: string;
}
