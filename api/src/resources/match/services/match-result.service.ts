import { Injectable } from '@nestjs/common';
import type { RecordResultDto } from '../dto/record-result.dto';
import type { Match } from '../entities/match.entity';
import { MatchRepository, type MatchResultRecord } from '../repository/match.repository';
import { findResultProblem, resolveWinnerId } from '../rules/result.rule';
import { MatchService } from './match.service';
import { toBadRequest } from './match-fixture-validator.service';

function toResultRecord(match: Match, actorId: string, input: RecordResultDto): MatchResultRecord {
  return {
    scoreA: input.scoreA,
    scoreB: input.scoreB,
    penaltiesA: input.penaltiesA ?? null,
    penaltiesB: input.penaltiesB ?? null,
    winnerId: resolveWinnerId(match, input),
    finalizedById: actorId,
    finalizedAt: new Date(),
    bestPlayerName: input.bestPlayerName ?? null,
    bestPlayerPhotoKey: input.bestPlayerPhotoKey ?? null,
    bestPlayerTeamId: input.bestPlayerTeamId ?? null,
  };
}

@Injectable()
export class MatchResultService {
  public constructor(
    private readonly matchRepository: MatchRepository,
    private readonly matchService: MatchService,
  ) {}

  public async record(id: string, actorId: string, input: RecordResultDto): Promise<Match> {
    const match = await this.matchService.findByIdOrFail(id);
    const problem = findResultProblem(match, input);
    if (problem) {
      throw toBadRequest(problem);
    }
    await this.matchRepository.saveResult(id, toResultRecord(match, actorId, input));
    return this.matchService.findByIdOrFail(id);
  }
}
