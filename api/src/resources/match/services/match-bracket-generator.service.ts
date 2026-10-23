import { ConflictException, Injectable } from '@nestjs/common';
import { apiError } from '../../../common/errors/api-error';
import { CategoryService } from '../../category/services/category.service';
import type { GenerateBracketDto } from '../dto/generate-bracket.dto';
import type { Match } from '../entities/match.entity';
import { MatchRound, MatchStage } from '../enums/match.enums';
import { MatchRepository, type MatchRecord } from '../repository/match.repository';
import {
  findBracketTeamsProblem,
  firstRoundFor,
  pairFirstRound,
  type BracketPairing,
} from '../rules/bracket.rule';
import { MatchFixtureValidator, toBadRequest } from './match-fixture-validator.service';

interface FirstRound {
  categoryId: string;
  round: MatchRound;
  input: GenerateBracketDto;
}

function toRecord({ categoryId, round, input }: FirstRound, pairing: BracketPairing): MatchRecord {
  return {
    categoryId,
    stage: MatchStage.KNOCKOUT,
    groupId: null,
    round,
    bracketPosition: pairing.bracketPosition,
    scheduledAt: new Date(input.scheduledAt),
    location: input.location ?? null,
    teamAId: pairing.teamAId,
    teamBId: pairing.teamBId,
  };
}

@Injectable()
export class MatchBracketGenerator {
  public constructor(
    private readonly matchRepository: MatchRepository,
    private readonly categoryService: CategoryService,
    private readonly fixtureValidator: MatchFixtureValidator,
  ) {}

  public async generate(categoryId: string, input: GenerateBracketDto): Promise<Match[]> {
    await this.categoryService.findByIdOrFail(categoryId);
    const problem = findBracketTeamsProblem(input.teamIds);
    if (problem) {
      throw toBadRequest(problem);
    }
    await this.assertNoBracket(categoryId);
    const round = firstRoundFor(input.teamIds.length);
    const pairings = pairFirstRound(input.teamIds);
    await this.assertTeamsBelongToCategory(categoryId, round, pairings);
    return this.matchRepository.createMany(
      pairings.map((pairing) => toRecord({ categoryId, round, input }, pairing)),
    );
  }

  private async assertNoBracket(categoryId: string): Promise<void> {
    const knockout = await this.matchRepository.findByCategory(categoryId, {
      stage: MatchStage.KNOCKOUT,
    });
    if (knockout.some((match) => match.bracketPosition !== null)) {
      throw new ConflictException(
        apiError('BRACKET_ALREADY_EXISTS', 'Esta categoria já tem chaveamento gerado.'),
      );
    }
  }

  private async assertTeamsBelongToCategory(
    categoryId: string,
    round: MatchRound,
    pairings: BracketPairing[],
  ): Promise<void> {
    await Promise.all(
      pairings.map(({ teamAId, teamBId }) =>
        this.fixtureValidator.assertValid(categoryId, {
          stage: MatchStage.KNOCKOUT,
          round,
          teamAId,
          teamBId,
        }),
      ),
    );
  }
}
