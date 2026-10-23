import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { apiError } from '../../../common/errors/api-error';
import { CategoryService } from '../../category/services/category.service';
import { MatchGroupService } from '../../match-group/services/match-group.service';
import type { CreateTeamDto } from '../dto/create-team.dto';
import type { UpdateTeamDto } from '../dto/update-team.dto';
import type { Team } from '../entities/team.entity';
import { TeamRepository } from '../repository/team.repository';

@Injectable()
export class TeamService {
  public constructor(
    private readonly teamRepository: TeamRepository,
    private readonly categoryService: CategoryService,
    private readonly matchGroupService: MatchGroupService,
  ) {}

  public async listByCategory(categoryId: number): Promise<Team[]> {
    await this.categoryService.findByIdOrFail(categoryId);
    return this.teamRepository.findByCategory(categoryId);
  }

  public async findByIdOrFail(id: number): Promise<Team> {
    const team = await this.teamRepository.findById(id);
    if (!team) {
      throw new NotFoundException(apiError('TEAM_NOT_FOUND', 'Time não encontrado.', 'id'));
    }
    return team;
  }

  public async create(categoryId: number, input: CreateTeamDto): Promise<Team> {
    await this.categoryService.findByIdOrFail(categoryId);
    await this.assertNameAvailable(categoryId, input.name);
    await this.assertGroupInCategory(categoryId, input.groupId);

    return this.teamRepository.create({
      categoryId,
      groupId: input.groupId ?? null,
      name: input.name,
    });
  }

  public async update(id: number, changes: UpdateTeamDto): Promise<Team> {
    const current = await this.findByIdOrFail(id);
    if (changes.name !== undefined && changes.name !== current.name) {
      await this.assertNameAvailable(current.categoryId, changes.name);
    }
    await this.assertGroupInCategory(current.categoryId, changes.groupId);
    await this.teamRepository.update(id, changes);
    return this.findByIdOrFail(id);
  }

  public async remove(id: number): Promise<void> {
    await this.findByIdOrFail(id);
    await this.teamRepository.remove(id);
  }

  private async assertGroupInCategory(
    categoryId: number,
    groupId: number | null | undefined,
  ): Promise<void> {
    if (groupId === undefined || groupId === null) {
      return;
    }
    const group = await this.matchGroupService.findByIdOrFail(groupId);
    if (group.categoryId !== categoryId) {
      throw new BadRequestException(
        apiError('GROUP_NOT_IN_CATEGORY', 'O grupo informado é de outra categoria.', 'groupId'),
      );
    }
  }

  private async assertNameAvailable(categoryId: number, name: string): Promise<void> {
    if (await this.teamRepository.findByCategoryAndName(categoryId, name)) {
      throw new ConflictException(
        apiError('TEAM_NAME_TAKEN', 'Já existe um time com este nome na categoria.', 'name'),
      );
    }
  }
}
