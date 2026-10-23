import { Injectable } from '@nestjs/common';
import { MatchResultType } from '../enums/match.enums';
import type { RecordResultDto } from '../dto/record-result.dto';
import type { Match } from '../entities/match.entity';
import { MatchRepository, type MatchResultRecord } from '../repository/match.repository';
import { findResultProblem, resolveWinnerId } from '../rules/result.rule';
import { MatchBracketAdvancer } from './match-bracket-advancer.service';
import { MatchService } from './match.service';
import { toBadRequest } from './match-fixture-validator.service';

type PlayFields = Pick<MatchResultRecord, 'scoreA' | 'scoreB' | 'penaltiesA' | 'penaltiesB'>;

type BestPlayerFields = Pick<
  MatchResultRecord,
  'bestPlayerName' | 'bestPlayerPhotoKey' | 'bestPlayerTeamId'
>;

function toPlayFields(input: RecordResultDto): PlayFields {
  return {
    scoreA: input.scoreA ?? null,
    scoreB: input.scoreB ?? null,
    penaltiesA: input.penaltiesA ?? null,
    penaltiesB: input.penaltiesB ?? null,
  };
}

function toBestPlayerFields(input: RecordResultDto): BestPlayerFields {
  return {
    bestPlayerName: input.bestPlayerName ?? null,
    bestPlayerPhotoKey: input.bestPlayerPhotoKey ?? null,
    bestPlayerTeamId: input.bestPlayerTeamId ?? null,
  };
}

function toResultRecord(match: Match, actorId: string, input: RecordResultDto): MatchResultRecord {
  return {
    ...toPlayFields(input),
    ...toBestPlayerFields(input),
    resultType: input.resultType ?? MatchResultType.PLAYED,
    winnerId: resolveWinnerId(match, input),
    finalizedById: actorId,
    finalizedAt: new Date(),
  };
}

@Injectable()
export class MatchResultService {
  public constructor(
    private readonly matchRepository: MatchRepository,
    private readonly matchService: MatchService,
    private readonly bracketAdvancer: MatchBracketAdvancer,
  ) {}

  public async record(id: string, actorId: string, input: RecordResultDto): Promise<Match> {
    const match = await this.matchService.findByIdOrFail(id);
    const problem = findResultProblem(match, input);
    if (problem) {
      throw toBadRequest(problem);
    }
    const record = toResultRecord(match, actorId, input);
    await this.bracketAdvancer.assertCorrectionAllowed(match, record.winnerId);
    await this.matchRepository.saveResult(id, record);
    const finalized = await this.matchService.findByIdOrFail(id);
    await this.bracketAdvancer.advance(finalized);
    return finalized;
  }
}
