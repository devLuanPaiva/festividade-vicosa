import { IS_PUBLIC_KEY, REQUIRED_PERMISSIONS_KEY } from '../../auth/decorators/decorators';
import { Permission } from '../../role/enums/permission.enum';
import { MatchStage, MatchStatus } from '../enums/match.enums';
import type { MatchResultService } from '../services/match-result.service';
import type { MatchService } from '../services/match.service';
import { MatchController } from './match.controller';

const MATCH_ID = '00000000-0000-4000-8000-0000000000d1';
const ACTOR = {
  id: '00000000-0000-4000-8000-000000000001',
  name: 'Ana',
  email: 'ana@example.com',
  permissions: [],
};

const stored = {
  id: MATCH_ID,
  categoryId: '00000000-0000-4000-8000-000000000005',
  stage: MatchStage.GROUP,
  groupId: '00000000-0000-4000-8000-000000000001',
  round: null,
  scheduledAt: new Date('2026-12-09T22:00:00.000Z'),
  location: null,
  status: MatchStatus.SCHEDULED,
  teamAId: '00000000-0000-4000-8000-0000000000a1',
  teamBId: '00000000-0000-4000-8000-0000000000b2',
  resultType: 'PLAYED',
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

describe('MatchController', () => {
  it('records the result as the logged user', async () => {
    const resultService = { record: jest.fn().mockResolvedValue(stored) };
    const controller = new MatchController(
      {} as unknown as MatchService,
      resultService as unknown as MatchResultService,
    );

    await controller.recordResult(ACTOR, MATCH_ID, { scoreA: 2, scoreB: 1 });

    expect(resultService.record).toHaveBeenCalledWith(MATCH_ID, ACTOR.id, { scoreA: 2, scoreB: 1 });
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
