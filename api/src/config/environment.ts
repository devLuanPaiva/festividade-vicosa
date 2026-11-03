import { plainToInstance, Type } from 'class-transformer';
import {
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
const MAX_REFRESH_TOKEN_DAYS = 90;

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
  public JWT_EXPIRES_IN = '15m';

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_REFRESH_TOKEN_DAYS)
  public REFRESH_TOKEN_EXPIRES_IN_DAYS = 7;

  @IsOptional()
  @IsString()
  public GOOGLE_CLIENT_ID?: string;

  @IsOptional()
  @IsString()
  public AWS_REGION?: string;

  @IsOptional()
  @IsString()
  public AWS_ACCESS_KEY_ID?: string;

  @IsOptional()
  @IsString()
  public AWS_SECRET_ACCESS_KEY?: string;

  @IsString()
  @IsNotEmpty()
  public S3_BUCKET = 'jocevs';

  @IsOptional()
  @IsString()
  public S3_ENDPOINT?: string;

  @IsString()
  @IsNotEmpty()
  public MEDIA_PUBLIC_URL = 'https://cdn.jocevs.com.br';
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
