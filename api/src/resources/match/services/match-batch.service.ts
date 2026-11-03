import { Injectable } from '@nestjs/common';
import { CategoryService } from '../../category/services/category.service';
import type { BatchMatchDto, CreateMatchBatchDto } from '../dto/create-match-batch.dto';
import type { Match } from '../entities/match.entity';
import { MatchRepository, type MatchRecord } from '../repository/match.repository';
import { findBatchProblem } from '../rules/batch.rule';
import { MatchFixtureValidator, toBadRequest } from './match-fixture-validator.service';

function toRecord(categoryId: string, input: BatchMatchDto): MatchRecord {
  return {
    categoryId,
    stage: input.stage,
    groupId: input.groupId ?? null,
    round: input.round ?? null,
    bracketPosition: input.bracketPosition ?? null,
    scheduledAt: new Date(input.scheduledAt),
    location: input.location ?? null,
    teamAId: input.teamAId,
    teamBId: input.teamBId,
  };
}

@Injectable()
export class MatchBatchService {
  public constructor(
    private readonly matchRepository: MatchRepository,
    private readonly categoryService: CategoryService,
    private readonly fixtureValidator: MatchFixtureValidator,
  ) {}

  public async createMany(categoryId: string, input: CreateMatchBatchDto): Promise<Match[]> {
    await this.categoryService.findByIdOrFail(categoryId);
    await Promise.all(
      input.matches.map((match) => this.fixtureValidator.assertValid(categoryId, match)),
    );
    const existing = await this.matchRepository.findByCategory(categoryId, {});
    const problem = findBatchProblem(input.matches, existing);
    if (problem) {
      throw toBadRequest(problem);
    }
    return this.matchRepository.createMany(
      input.matches.map((match) => toRecord(categoryId, match)),
    );
  }
}
