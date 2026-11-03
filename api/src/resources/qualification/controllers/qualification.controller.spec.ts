import { REQUIRED_PERMISSIONS_KEY } from '../../auth/decorators/decorators';
import { Permission } from '../../role/enums/permission.enum';
import type { QualificationService } from '../services/qualification.service';
import { QualificationController } from './qualification.controller';

const GROUP_ID = '00000000-0000-4000-8000-000000000001';

describe('QualificationController', () => {
  it('confirms the qualified teams and answers only with team and position', async () => {
    const service = {
      confirm: jest.fn().mockResolvedValue([{ groupId: GROUP_ID, teamId: 'alfa', position: 1 }]),
    };
    const controller = new QualificationController(service as unknown as QualificationService);

    const response = await controller.confirm(GROUP_ID, { teamIds: ['alfa'] });

    expect(service.confirm).toHaveBeenCalledWith(GROUP_ID, ['alfa']);
    expect(response).toEqual([{ teamId: 'alfa', position: 1 }]);
  });

  it('requires the team permission', () => {
    const permissions: unknown = Reflect.getMetadata(
      REQUIRED_PERMISSIONS_KEY,
      QualificationController.prototype.confirm,
    );

    expect(permissions).toEqual([Permission.TEAM_MANAGE]);
  });
});
