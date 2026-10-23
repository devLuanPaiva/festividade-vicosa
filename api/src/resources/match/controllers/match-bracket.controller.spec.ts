import { REQUIRED_PERMISSIONS_KEY } from '../../auth/decorators/decorators';
import { Permission } from '../../role/enums/permission.enum';
import { MatchResultType, MatchRound, MatchStage, MatchStatus } from '../enums/match.enums';
import type { MatchBracketGenerator } from '../services/match-bracket-generator.service';
import { MatchBracketController } from './match-bracket.controller';

const CATEGORY_ID = '00000000-0000-4000-8000-000000000005';

const stored = {
  id: '00000000-0000-4000-8000-0000000000d1',
  categoryId: CATEGORY_ID,
  stage: MatchStage.KNOCKOUT,
  groupId: null,
  round: MatchRound.SEMI_FINAL,
  bracketPosition: 0,
  scheduledAt: new Date('2026-12-18T22:00:00.000Z'),
  location: null,
  status: MatchStatus.SCHEDULED,
  teamAId: '00000000-0000-4000-8000-0000000000a1',
  teamBId: '00000000-0000-4000-8000-0000000000b2',
  resultType: MatchResultType.PLAYED,
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

describe('MatchBracketController', () => {
  it('generates the bracket of the category of the url and answers with response dtos', async () => {
    const generator = { generate: jest.fn().mockResolvedValue([stored]) };
    const controller = new MatchBracketController(generator as unknown as MatchBracketGenerator);
    const input = { teamIds: [], scheduledAt: '2026-12-18T19:00:00-03:00' };

    const [match] = await controller.generate(CATEGORY_ID, input);

    expect(generator.generate).toHaveBeenCalledWith(CATEGORY_ID, input);
    expect(match).toMatchObject({ round: MatchRound.SEMI_FINAL, bracketPosition: 0 });
  });

  it('requires the match permission', () => {
    const permissions: unknown = Reflect.getMetadata(
      REQUIRED_PERMISSIONS_KEY,
      MatchBracketController.prototype.generate,
    );

    expect(permissions).toEqual([Permission.MATCH_CREATE]);
  });
});
