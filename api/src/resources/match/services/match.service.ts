import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { apiError } from '../../../common/errors/api-error';
import { CategoryService } from '../../category/services/category.service';
import type { CreateMatchDto } from '../dto/create-match.dto';
import type { UpdateMatchDto } from '../dto/update-match.dto';
import type { Match } from '../entities/match.entity';
import { MatchStatus } from '../enums/match.enums';
import { MatchRepository, type MatchFilters } from '../repository/match.repository';
import { MatchFixtureValidator } from './match-fixture-validator.service';

@Injectable()
export class MatchService {
  public constructor(
    private readonly matchRepository: MatchRepository,
    private readonly categoryService: CategoryService,
    private readonly fixtureValidator: MatchFixtureValidator,
  ) {}

  public async listByCategory(categoryId: string, filters: MatchFilters): Promise<Match[]> {
    await this.categoryService.findByIdOrFail(categoryId);
    return this.matchRepository.findByCategory(categoryId, filters);
  }

  public async findByIdOrFail(id: string): Promise<Match> {
    const match = await this.matchRepository.findById(id);
    if (!match) {
      throw new NotFoundException(apiError('MATCH_NOT_FOUND', 'Partida não encontrada.', 'id'));
    }
    return match;
  }

  public async create(categoryId: string, input: CreateMatchDto): Promise<Match> {
    await this.categoryService.findByIdOrFail(categoryId);
    await this.fixtureValidator.assertValid(categoryId, input);
    return this.matchRepository.create({
      categoryId,
      stage: input.stage,
      groupId: input.groupId ?? null,
      round: input.round ?? null,
      bracketPosition: null,
      scheduledAt: new Date(input.scheduledAt),
      location: input.location ?? null,
      teamAId: input.teamAId,
      teamBId: input.teamBId,
    });
  }

  public async update(id: string, changes: UpdateMatchDto): Promise<Match> {
    const current = await this.findByIdOrFail(id);
    if (changes.teamAId !== undefined || changes.teamBId !== undefined) {
      await this.assertTeamsCanChange(current, changes);
    }
    const { scheduledAt, location, ...rest } = changes;
    await this.matchRepository.update(id, {
      ...rest,
      ...(scheduledAt && { scheduledAt: new Date(scheduledAt) }),
      ...(location !== undefined && { location: location.trim() || null }),
    });
    return this.findByIdOrFail(id);
  }

  public async remove(id: string): Promise<void> {
    await this.findByIdOrFail(id);
    await this.matchRepository.remove(id);
  }

  private async assertTeamsCanChange(current: Match, changes: UpdateMatchDto): Promise<void> {
    if (current.status !== MatchStatus.SCHEDULED) {
      throw new ConflictException(
        apiError(
          'MATCH_ALREADY_FINALIZED',
          'Não é possível trocar os times de uma partida finalizada.',
          'teamAId',
        ),
      );
    }
    await this.fixtureValidator.assertValid(current.categoryId, {
      stage: current.stage,
      groupId: current.groupId,
      round: current.round,
      teamAId: changes.teamAId ?? current.teamAId,
      teamBId: changes.teamBId ?? current.teamBId,
    });
  }
}
