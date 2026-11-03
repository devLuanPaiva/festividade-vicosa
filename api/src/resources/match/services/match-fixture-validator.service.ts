import { BadRequestException, Injectable } from '@nestjs/common';
import { apiError } from '../../../common/errors/api-error';
import { MatchGroupService } from '../../match-group/services/match-group.service';
import { TeamService } from '../../team/services/team.service';
import { findFixtureProblem, type FixtureShape } from '../rules/fixture.rule';
import { findParticipantsProblem, type ParticipantsShape } from '../rules/participants.rule';
import type { RuleProblem } from '../rules/rule-problem';

export function toBadRequest({ code, detail, field }: RuleProblem): BadRequestException {
  return new BadRequestException(apiError(code, detail, field));
}

@Injectable()
export class MatchFixtureValidator {
  public constructor(
    private readonly teamService: TeamService,
    private readonly matchGroupService: MatchGroupService,
  ) {}

  public async assertValid(categoryId: string, fixture: FixtureShape): Promise<void> {
    const fixtureProblem = findFixtureProblem(fixture);
    if (fixtureProblem) {
      throw toBadRequest(fixtureProblem);
    }
    const participantsProblem = findParticipantsProblem(
      await this.loadParticipants(categoryId, fixture),
    );
    if (participantsProblem) {
      throw toBadRequest(participantsProblem);
    }
  }

  private async loadParticipants(
    categoryId: string,
    fixture: FixtureShape,
  ): Promise<ParticipantsShape> {
    const [teamA, teamB] = await Promise.all([
      this.teamService.findByIdOrFail(fixture.teamAId),
      this.teamService.findByIdOrFail(fixture.teamBId),
    ]);
    const group = fixture.groupId
      ? await this.matchGroupService.findByIdOrFail(fixture.groupId)
      : null;
    return { categoryId, stage: fixture.stage, groupId: fixture.groupId, group, teamA, teamB };
  }
}
