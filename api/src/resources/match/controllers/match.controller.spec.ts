import { IS_PUBLIC_KEY, REQUIRED_PERMISSIONS_KEY } from '../../auth/decorators/decorators';
import { Permission } from '../../role/enums/permission.enum';
import { MatchStage, MatchStatus } from '../enums/match.enums';
import type { MatchResultService } from '../services/match-result.service';
import type { MatchService } from '../services/match.service';
import { MatchController } from './match.controller';

const MATCH_ID = '00000000-0000-4000-8000-0000000000d1';
const CATEGORY_ID = '00000000-0000-4000-8000-000000000005';
const ACTOR = {
  id: '00000000-0000-4000-8000-000000000001',
  name: 'Ana',
  email: 'ana@example.com',
  permissions: [],
};

const stored = {
  id: MATCH_ID,
  categoryId: CATEGORY_ID,
  stage: MatchStage.GROUP,
  groupId: '00000000-0000-4000-8000-000000000001',
  round: null,
  scheduledAt: new Date('2026-12-09T22:00:00.000Z'),
  location: null,
  status: MatchStatus.SCHEDULED,
  teamAId: '00000000-0000-4000-8000-0000000000a1',
  teamBId: '00000000-0000-4000-8000-0000000000b2',
  scoreA: null,
  scoreB: null,
  penaltiesA: null,
  penaltiesB: null,
  winnerId: null,
  finalizedById: null,
  finalizedAt: null,
  bestPlayerName: null,
  bestPlayerPhotoKey: null,
  bestPlayerTeamId: null,
};

function createController(): {
  controller: MatchController;
  matchService: Record<
    'listByCategory' | 'findByIdOrFail' | 'create' | 'update' | 'remove',
    jest.Mock
  >;
  resultService: Record<'record', jest.Mock>;
} {
  const matchService = {
    listByCategory: jest.fn().mockResolvedValue([stored]),
    findByIdOrFail: jest.fn().mockResolvedValue(stored),
    create: jest.fn().mockResolvedValue(stored),
    update: jest.fn().mockResolvedValue(stored),
    remove: jest.fn().mockResolvedValue(undefined),
  };
  const resultService = { record: jest.fn().mockResolvedValue(stored) };
  const controller = new MatchController(
    matchService as unknown as MatchService,
    resultService as unknown as MatchResultService,
  );
  return { controller, matchService, resultService };
}

describe('MatchController', () => {
  it('lists the matches of a category as response dtos passing the filters on', async () => {
    const { controller, matchService } = createController();
    const filters = { status: MatchStatus.FINALIZED };

    const [match] = await controller.listByCategory(CATEGORY_ID, filters);

    expect(match).toMatchObject({ id: MATCH_ID, scheduledAt: '2026-12-09T22:00:00.000Z' });
    expect(matchService.listByCategory).toHaveBeenCalledWith(CATEGORY_ID, filters);
  });

  it('gets one match by id', async () => {
    const { controller } = createController();

    await expect(controller.get(MATCH_ID)).resolves.toMatchObject({
      id: MATCH_ID,
      bestPlayer: null,
    });
  });

  it('creates a match inside the category of the url', async () => {
    const { controller, matchService } = createController();
    const input = { stage: MatchStage.GROUP, scheduledAt: '2026-12-09T19:00:00-03:00' } as never;

    await controller.create(CATEGORY_ID, input);

    expect(matchService.create).toHaveBeenCalledWith(CATEGORY_ID, input);
  });

  it('updates a match', async () => {
    const { controller, matchService } = createController();

    await controller.update(MATCH_ID, { location: 'Ginásio' });

    expect(matchService.update).toHaveBeenCalledWith(MATCH_ID, { location: 'Ginásio' });
  });

  it('records the result as the logged user', async () => {
    const { controller, resultService } = createController();

    await controller.recordResult(ACTOR, MATCH_ID, { scoreA: 2, scoreB: 1 });

    expect(resultService.record).toHaveBeenCalledWith(MATCH_ID, ACTOR.id, { scoreA: 2, scoreB: 1 });
  });

  it('removes a match', async () => {
    const { controller, matchService } = createController();

    await controller.remove(MATCH_ID);

    expect(matchService.remove).toHaveBeenCalledWith(MATCH_ID);
  });
});

describe('MatchController access', () => {
  it.each(['listByCategory', 'get'] as const)('lets visitors call %s without login', (handler) => {
    expect(Reflect.getMetadata(IS_PUBLIC_KEY, MatchController.prototype[handler])).toBe(true);
  });

  it.each(['create', 'update', 'remove'] as const)(
    'requires match creation to call %s',
    (handler) => {
      expect(
        Reflect.getMetadata(REQUIRED_PERMISSIONS_KEY, MatchController.prototype[handler]),
      ).toEqual([Permission.MATCH_CREATE]);
    },
  );

  it('requires the score permission to record a result', () => {
    expect(
      Reflect.getMetadata(REQUIRED_PERMISSIONS_KEY, MatchController.prototype.recordResult),
    ).toEqual([Permission.MATCH_RECORD_SCORE]);
  });
});
