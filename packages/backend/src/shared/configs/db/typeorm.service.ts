import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseConfigService } from './config.service';
import { join } from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

const DatabaseConfig: TypeOrmModuleOptions & {
  seeds: string[];
  factories: string[];
} = {
  type: 'mysql',
  host: DatabaseConfigService.host,
  port: parseInt(DatabaseConfigService.port ?? '3306'),
  database: DatabaseConfigService.database,
  username: DatabaseConfigService.username,
  password: DatabaseConfigService.password,
  entities: [join(process.cwd(), 'dist/**/*.entity.js')],
  migrations: [join(__dirname, '**/*.migration{.ts,.js}')],
  seeds: [join(__dirname, '**/seeds/*{.ts,.js}')],
  factories: [join(__dirname, '**/factories/*{.ts,.js}')],  
  synchronize: true,
  timezone: '+02:00',
  logging: ['error']
};

export default DatabaseConfig;

const rootDir = process.cwd();
export const DatabaseConfigForSeed: TypeOrmModuleOptions & {
  factories: string[];
  seeds: string[];
} = {
  ...DatabaseConfig,
  entities: [join(rootDir, '/**/*.entity!(*.d){.ts,.js}')],
  seeds: [join(rootDir, 'src/**/seeds/*!(*.d){.ts,.js}')],
  factories: [join(rootDir, 'src/**/factories/*!(*.d){.ts,.js}')],
};
