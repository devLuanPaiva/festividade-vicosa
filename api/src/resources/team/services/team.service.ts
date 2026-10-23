import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { apiError } from '../../../common/errors/api-error';
import { runUnlessReferenced } from '../../../common/database/foreign-key-violation';
import { CategoryService } from '../../category/services/category.service';
import { MatchGroupService } from '../../match-group/services/match-group.service';
import type { CreateTeamDto } from '../dto/create-team.dto';
import type { UpdateTeamDto } from '../dto/update-team.dto';
import type { Team } from '../entities/team.entity';
import { TeamRepository, type TeamFilters } from '../repository/team.repository';
import { slugify } from '../rules/slug.rule';

@Injectable()
export class TeamService {
  public constructor(
    private readonly teamRepository: TeamRepository,
    private readonly categoryService: CategoryService,
    private readonly matchGroupService: MatchGroupService,
  ) {}

  public async listByCategory(categoryId: string, filters: TeamFilters): Promise<Team[]> {
    await this.categoryService.findByIdOrFail(categoryId);
    return this.teamRepository.findByCategory(categoryId, filters);
  }

  public listByIds(ids: string[]): Promise<Team[]> {
    return this.teamRepository.findByIds(ids);
  }

  public async findByIdOrFail(id: string): Promise<Team> {
    const team = await this.teamRepository.findById(id);
    if (!team) {
      throw new NotFoundException(apiError('TEAM_NOT_FOUND', 'Time não encontrado.', 'id'));
    }
    return team;
  }

  public async create(categoryId: string, input: CreateTeamDto): Promise<Team> {
    const slug = input.slug ?? slugify(input.name);
    await this.categoryService.findByIdOrFail(categoryId);
    await this.assertNameAvailable(categoryId, input.name);
    await this.assertSlugAvailable(categoryId, slug);
    await this.assertGroupInCategory(categoryId, input.groupId);

    return this.teamRepository.create({
      categoryId,
      groupId: input.groupId ?? null,
      name: input.name,
      slug,
      city: input.city,
      abbreviation: input.abbreviation ?? null,
      photoKey: input.photoKey ?? null,
    });
  }

  public async update(id: string, changes: UpdateTeamDto): Promise<Team> {
    const current = await this.findByIdOrFail(id);
    await this.assertUniqueFieldsAvailable(current, changes);
    await this.assertGroupInCategory(current.categoryId, changes.groupId);
    await this.teamRepository.update(id, changes);
    return this.findByIdOrFail(id);
  }

  public async remove(id: string): Promise<void> {
    await this.findByIdOrFail(id);
    await this.removeUnlessReferenced(id);
  }

  private removeUnlessReferenced(id: string): Promise<void> {
    return runUnlessReferenced(
      () => this.teamRepository.remove(id),
      () =>
        new ConflictException(
          apiError(
            'TEAM_HAS_MATCHES',
            'Este time tem partidas. Exclua as partidas antes de excluir o time.',
            'id',
          ),
        ),
    );
  }

  private async assertUniqueFieldsAvailable(current: Team, changes: UpdateTeamDto): Promise<void> {
    if (changes.name !== undefined && changes.name !== current.name) {
      await this.assertNameAvailable(current.categoryId, changes.name);
    }
    if (changes.slug !== undefined && changes.slug !== current.slug) {
      await this.assertSlugAvailable(current.categoryId, changes.slug);
    }
  }

  private async assertGroupInCategory(
    categoryId: string,
    groupId: string | null | undefined,
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

  private async assertNameAvailable(categoryId: string, name: string): Promise<void> {
    if (await this.teamRepository.findByCategoryAndName(categoryId, name)) {
      throw new ConflictException(
        apiError('TEAM_NAME_TAKEN', 'Já existe um time com este nome na categoria.', 'name'),
      );
    }
  }

  private async assertSlugAvailable(categoryId: string, slug: string): Promise<void> {
    if (await this.teamRepository.findByCategoryAndSlug(categoryId, slug)) {
      throw new ConflictException(
        apiError('TEAM_SLUG_TAKEN', 'Já existe um time com este slug na categoria.', 'slug'),
      );
    }
  }
}
