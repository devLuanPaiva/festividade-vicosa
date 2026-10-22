import { join } from 'node:path';
import { DataSource } from 'typeorm';
import { validateEnvironment } from '../config/environment';
import { buildTypeOrmOptions } from './typeorm-options';

export default new DataSource({
  ...buildTypeOrmOptions(validateEnvironment(process.env)),
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
});
