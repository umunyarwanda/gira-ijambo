import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import 'module-alias/register';
config();

const rootDir = process.cwd();

export const AppDataSource = new DataSource({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  logging: true,
  type: 'mysql',
  entities: [join(rootDir, 'dist/**/*.entity.js')],
  migrations: [join(rootDir, '/**/*-migration.js')],
  synchronize: false,
  migrationsRun: true,
});
