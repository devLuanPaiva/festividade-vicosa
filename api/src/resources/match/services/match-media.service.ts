import { Injectable } from '@nestjs/common';
import { MediaFolder, type MediaTarget } from '../../../storage/rules/media-key.rule';
import { CategoryService } from '../../category/services/category.service';
import { TeamService } from '../../team/services/team.service';
import { matchFolderName } from '../rules/match-folder.rule';
import { MatchService } from './match.service';

@Injectable()
export class MatchMediaService {
  public constructor(
    private readonly matchService: MatchService,
    private readonly teamService: TeamService,
    private readonly categoryService: CategoryService,
  ) {}

  public async targetFor(matchId: string, folder: MediaFolder): Promise<MediaTarget> {
    const match = await this.matchService.findByIdOrFail(matchId);
    const [teamA, teamB, categoryFolder] = await Promise.all([
      this.teamService.findByIdOrFail(match.teamAId),
      this.teamService.findByIdOrFail(match.teamBId),
      this.categoryService.mediaFolderOf(match.categoryId),
    ]);
    const matchFolder = matchFolderName({
      teamASlug: teamA.slug,
      teamBSlug: teamB.slug,
      scheduledAt: match.scheduledAt,
    });
    return { folder, segments: [categoryFolder, matchFolder] };
  }
}
