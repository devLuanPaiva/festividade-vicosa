import type { MatchRepository } from '../repository/match.repository';
import { MatchResultType, MatchStage } from '../enums/match.enums';
import { MatchResultService } from './match-result.service';
import type { MatchService } from './match.service';
import { MATCH_ID, TEAM_A, TEAM_B, stored } from './match.service.fixture';

const ACTOR_ID = '00000000-0000-4000-8000-000000000001';
const knockoutMatch = { ...stored, stage: MatchStage.KNOCKOUT, groupId: null };

function createFixture(match: object = stored): {
  service: MatchResultService;
  repository: Record<'saveResult', jest.Mock>;
} {
  const repository = { saveResult: jest.fn().mockResolvedValue(undefined) };
  const matchService = { findByIdOrFail: jest.fn().mockResolvedValue(match) };
  const service = new MatchResultService(
    repository as unknown as MatchRepository,
    matchService as unknown as MatchService,
  );
  return { service, repository };
}

describe('MatchResultService.record', () => {
  it('finalizes a group match with the winner, the actor and no penalties', async () => {
    const { service, repository } = createFixture();

    await service.record(MATCH_ID, ACTOR_ID, { scoreA: 3, scoreB: 1 });

    expect(repository.saveResult).toHaveBeenCalledWith(
      MATCH_ID,
      expect.objectContaining({
        resultType: MatchResultType.PLAYED,
        scoreA: 3,
        scoreB: 1,
        penaltiesA: null,
        penaltiesB: null,
        winnerId: TEAM_A,
        finalizedById: ACTOR_ID,
        finalizedAt: expect.any(Date) as Date,
        bestPlayerName: null,
      }),
    );
  });

  it('keeps the score and decides a knockout draw on the penalties (RN-24)', async () => {
    const { service, repository } = createFixture(knockoutMatch);

    await service.record(MATCH_ID, ACTOR_ID, {
      scoreA: 2,
      scoreB: 2,
      penaltiesA: 3,
      penaltiesB: 4,
    });

    expect(repository.saveResult).toHaveBeenCalledWith(
      MATCH_ID,
      expect.objectContaining({
        scoreA: 2,
        scoreB: 2,
        penaltiesA: 3,
        penaltiesB: 4,
        winnerId: TEAM_B,
      }),
    );
  });

  it('records the best player of one of the teams', async () => {
    const { service, repository } = createFixture();

    await service.record(MATCH_ID, ACTOR_ID, {
      scoreA: 1,
      scoreB: 0,
      bestPlayerName: 'Ana',
      bestPlayerPhotoKey: 'photos/ana',
      bestPlayerTeamId: TEAM_A,
    });

    expect(repository.saveResult).toHaveBeenCalledWith(
      MATCH_ID,
      expect.objectContaining({
        bestPlayerName: 'Ana',
        bestPlayerPhotoKey: 'photos/ana',
        bestPlayerTeamId: TEAM_A,
      }),
    );
  });

  it('gives the win to the team that showed up on a walkover, without goals', async () => {
    const { service, repository } = createFixture();

    await service.record(MATCH_ID, ACTOR_ID, {
      resultType: MatchResultType.WALKOVER,
      walkoverWinnerId: TEAM_B,
    });

    expect(repository.saveResult).toHaveBeenCalledWith(MATCH_ID, {
      resultType: MatchResultType.WALKOVER,
      scoreA: null,
      scoreB: null,
      penaltiesA: null,
      penaltiesB: null,
      winnerId: TEAM_B,
      finalizedById: ACTOR_ID,
      finalizedAt: expect.any(Date) as Date,
      bestPlayerName: null,
      bestPlayerPhotoKey: null,
      bestPlayerTeamId: null,
    });
  });

  it('records a double walkover without winner', async () => {
    const { service, repository } = createFixture();

    await service.record(MATCH_ID, ACTOR_ID, { resultType: MatchResultType.DOUBLE_WALKOVER });

    expect(repository.saveResult).toHaveBeenCalledWith(
      MATCH_ID,
      expect.objectContaining({ resultType: MatchResultType.DOUBLE_WALKOVER, winnerId: null }),
    );
  });

  it('refuses a result that breaks the rules without saving it', async () => {
    const { service, repository } = createFixture(knockoutMatch);

    await expect(
      service.record(MATCH_ID, ACTOR_ID, { scoreA: 1, scoreB: 1 }),
    ).rejects.toMatchObject({
      response: { code: 'PENALTIES_REQUIRED', field: 'penaltiesA' },
    });
    expect(repository.saveResult).not.toHaveBeenCalled();
  });
});
