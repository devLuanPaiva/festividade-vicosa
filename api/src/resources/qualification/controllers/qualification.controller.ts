import { Body, Controller, Param, Put } from '@nestjs/common';
import { ParseIdPipe } from '../../../common/pipes/parse-id.pipe';
import { RequirePermission } from '../../auth/decorators/decorators';
import { Permission } from '../../role/enums/permission.enum';
import { ConfirmQualifiedDto } from '../dto/confirm-qualified.dto';
import type { QualifiedTeamResponseDto } from '../dto/qualified-team-response.dto';
import { QualificationService } from '../services/qualification.service';

@Controller()
export class QualificationController {
  public constructor(private readonly qualificationService: QualificationService) {}

  @Put('groups/:id/qualified')
  @RequirePermission(Permission.TEAM_MANAGE)
  public async confirm(
    @Param('id', ParseIdPipe) id: string,
    @Body() input: ConfirmQualifiedDto,
  ): Promise<QualifiedTeamResponseDto[]> {
    const qualified = await this.qualificationService.confirm(id, input.teamIds);
    return qualified.map(({ teamId, position }) => ({ teamId, position }));
  }
}
