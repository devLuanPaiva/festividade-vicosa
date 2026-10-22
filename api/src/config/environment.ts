import { plainToInstance, Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsString, Max, Min, validateSync } from 'class-validator';

export enum NodeEnvironment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

const MAX_TCP_PORT = 65535;

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
