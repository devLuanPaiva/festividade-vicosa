import { plainToInstance, Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  validateSync,
} from 'class-validator';

export enum NodeEnvironment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

const MAX_TCP_PORT = 65535;
const MIN_JWT_SECRET_LENGTH = 32;
const MIN_ADMIN_PASSWORD_LENGTH = 6;

export class EnvironmentVariables {
  @IsEnum(NodeEnvironment)
  public NODE_ENV: NodeEnvironment = NodeEnvironment.DEVELOPMENT;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_TCP_PORT)
  public PORT = 3000;

  @IsString()
  @IsNotEmpty()
  public DATABASE_HOST!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_TCP_PORT)
  public DATABASE_PORT = 5432;

  @IsString()
  @IsNotEmpty()
  public DATABASE_USER!: string;

  @IsString()
  @IsNotEmpty()
  public DATABASE_PASSWORD!: string;

  @IsString()
  @IsNotEmpty()
  public DATABASE_NAME!: string;

  @IsString()
  public CORS_ORIGIN = 'http://localhost:3001';

  @IsString()
  @MinLength(MIN_JWT_SECRET_LENGTH)
  public JWT_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  public JWT_EXPIRES_IN = '12h';

  @IsOptional()
  @IsEmail()
  public ADMIN_EMAIL?: string;

  @IsOptional()
  @IsString()
  @MinLength(MIN_ADMIN_PASSWORD_LENGTH)
  public ADMIN_INITIAL_PASSWORD?: string;
}

export function validateEnvironment(config: Record<string, unknown>): EnvironmentVariables {
  const environment = plainToInstance(EnvironmentVariables, config);
  const errors = validateSync(environment, { skipMissingProperties: false });

  if (errors.length > 0) {
    const failedVariables = errors.map((error) => error.property).join(', ');
    throw new Error(`Invalid environment variables: ${failedVariables}`);
  }

  return environment;
}
