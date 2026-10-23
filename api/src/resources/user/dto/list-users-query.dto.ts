import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { SearchQueryDto } from '../../../common/query/search-query.dto';
import { VALIDATION_MESSAGES } from '../../../common/validation/validation-messages';
import { RoleCode } from '../../role/enums/role-code.enum';

const BOOLEAN_BY_TEXT: Record<string, boolean> = { true: true, false: false };

export class ListUsersQueryDto extends SearchQueryDto {
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => BOOLEAN_BY_TEXT[String(value)] ?? value)
  @IsBoolean({ message: VALIDATION_MESSAGES.active })
  public active?: boolean;

  @IsOptional()
  @IsEnum(RoleCode, { message: VALIDATION_MESSAGES.roleCode })
  public roleCode?: RoleCode;
}
