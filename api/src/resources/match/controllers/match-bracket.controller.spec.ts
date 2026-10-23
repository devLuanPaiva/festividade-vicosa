import { REQUIRED_PERMISSIONS_KEY } from '../../auth/decorators/decorators';
import { Permission } from '../../role/enums/permission.enum';
import { MatchBracketController } from './match-bracket.controller';

describe('MatchBracketController', () => {
  it('requires the match permission', () => {
    const permissions: unknown = Reflect.getMetadata(
      REQUIRED_PERMISSIONS_KEY,
      MatchBracketController.prototype.generate,
    );

    expect(permissions).toEqual([Permission.MATCH_CREATE]);
  });
});
