import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
config();

const configService = new ConfigService();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST') ?? 'localhost',
  port: parseInt(configService.get<string>('DATABASE_PORT') ?? '5432', 10),
  username: configService.get<string>('DATABASE_USERNAME') ?? 'user',
  password: configService.get<string>('DATABASE_PASSWORD') ?? 'password',
  database: configService.get<string>('DATABASE_NAME') ?? 'mydatabase',
  synchronize: false,
  entities: ['**/*.entity.ts'],
  migrations: ['src/database/migrations/*-migration.ts'],
  migrationsRun: false,
  logging: true,
});

export default AppDataSource;
