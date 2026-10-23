import { BadRequestException } from '@nestjs/common';
import type { MatchGroupService } from '../../match-group/services/match-group.service';
import type { TeamService } from '../../team/services/team.service';
import { MatchRound, MatchStage } from '../enums/match.enums';
import { MatchFixtureValidator } from './match-fixture-validator.service';

const CATEGORY = '00000000-0000-4000-8000-000000000005';
const OTHER_CATEGORY = '00000000-0000-4000-8000-000000000006';
const GROUP = '00000000-0000-4000-8000-000000000001';
const TEAM_A = '00000000-0000-4000-8000-0000000000a1';
const TEAM_B = '00000000-0000-4000-8000-0000000000b2';

const groupFixture = {
  stage: MatchStage.GROUP,
  groupId: GROUP,
  round: null,
  teamAId: TEAM_A,
  teamBId: TEAM_B,
};

function createValidator(): {
  validator: MatchFixtureValidator;
  teamService: Record<'findByIdOrFail', jest.Mock>;
  matchGroupService: Record<'findByIdOrFail', jest.Mock>;
} {
  const teamService = {
    findByIdOrFail: jest.fn().mockResolvedValue({ categoryId: CATEGORY, groupId: GROUP }),
  };
  const matchGroupService = {
    findByIdOrFail: jest.fn().mockResolvedValue({ categoryId: CATEGORY }),
  };
  const validator = new MatchFixtureValidator(
    teamService as unknown as TeamService,
    matchGroupService as unknown as MatchGroupService,
  );
  return { validator, teamService, matchGroupService };
}

describe('MatchFixtureValidator', () => {
  it('accepts a group match between two teams of the group', async () => {
    const { validator } = createValidator();

    await expect(validator.assertValid(CATEGORY, groupFixture)).resolves.toBeUndefined();
  });

  it('accepts a knockout match without loading any group', async () => {
    const { validator, matchGroupService } = createValidator();

    await validator.assertValid(CATEGORY, {
      stage: MatchStage.KNOCKOUT,
      round: MatchRound.FINAL,
      teamAId: TEAM_A,
      teamBId: TEAM_B,
    });

    expect(matchGroupService.findByIdOrFail).not.toHaveBeenCalled();
  });

  it('refuses a malformed fixture before touching the database', async () => {
    const { validator, teamService } = createValidator();

    await expect(
      validator.assertValid(CATEGORY, { ...groupFixture, teamBId: TEAM_A }),
    ).rejects.toMatchObject({ response: { code: 'SAME_TEAM', field: 'teamBId' } });
    expect(teamService.findByIdOrFail).not.toHaveBeenCalled();
  });

  it('refuses a team from another category as a bad request (RN-15)', async () => {
    const { validator, teamService } = createValidator();
    teamService.findByIdOrFail.mockResolvedValueOnce({
      categoryId: OTHER_CATEGORY,
      groupId: GROUP,
    });

    const failure = validator.assertValid(CATEGORY, groupFixture);

    await expect(failure).rejects.toBeInstanceOf(BadRequestException);
    await expect(failure).rejects.toMatchObject({
      response: { code: 'TEAM_NOT_IN_CATEGORY', field: 'teamAId' },
    });
  });

  it('refuses a team that is not in the group of a group match', async () => {
    const { validator, teamService } = createValidator();
    teamService.findByIdOrFail.mockResolvedValue({ categoryId: CATEGORY, groupId: null });

    await expect(validator.assertValid(CATEGORY, groupFixture)).rejects.toMatchObject({
      response: { code: 'TEAM_NOT_IN_GROUP' },
    });
  });
});
